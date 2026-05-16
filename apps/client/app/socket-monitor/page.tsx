"use client"

import { Activity, Cable, CircleDot, PlugZap, Unplug } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { io, type Socket } from "socket.io-client"

type MarketTradeCreatedPayload = {
  symbol?: string
  marketId?: string
  lastPrice?: number
  totalQuantity?: number
  takerOrderId?: string
  trades?: Array<{
    id?: string
    price?: number
    quantity?: number
    total?: number
    side?: "buy" | "sell"
    createdAt?: string
  }>
}

type EventLog = {
  id: string
  receivedAt: string
  payload: MarketTradeCreatedPayload
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3002"

const normalizeMarketSymbol = (symbol: string) =>
  symbol.trim().replace("/", "").replace("-", "").toUpperCase()

const formatPrice = (value?: number) => {
  if (typeof value !== "number") return "—"

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function SocketMonitorPage() {
  const socketRef = useRef<Socket | null>(null)
  const joinedSymbolRef = useRef("BTCUSDT")
  const [symbolInput, setSymbolInput] = useState("BTCUSDT")
  const [joinedSymbol, setJoinedSymbol] = useState("BTCUSDT")
  const [status, setStatus] = useState<"connecting" | "connected" | "closed">(
    "connecting"
  )
  const [socketId, setSocketId] = useState<string>()
  const [events, setEvents] = useState<EventLog[]>([])

  const latestEvent = events[0]
  const latestPayload = latestEvent?.payload
  const latestTrade = latestPayload?.trades?.at(-1)

  useEffect(() => {
    const socket = io(WS_URL, {
      transports: ["websocket"],
      reconnection: true,
    })

    socketRef.current = socket

    socket.on("connect", () => {
      setStatus("connected")
      setSocketId(socket.id)
      socket.emit("market.join", { symbol: joinedSymbolRef.current })
    })

    socket.on("disconnect", () => {
      setStatus("closed")
      setSocketId(undefined)
    })

    socket.on("connect_error", () => {
      setStatus("closed")
    })

    socket.on("market.trade.created", (payload: MarketTradeCreatedPayload) => {
      setEvents((prev) => [
        {
          id: `${Date.now()}-${prev.length}`,
          receivedAt: new Date().toLocaleTimeString("vi-VN"),
          payload,
        },
        ...prev.slice(0, 19),
      ])
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  useEffect(() => {
    joinedSymbolRef.current = joinedSymbol

    if (socketRef.current?.connected) {
      socketRef.current.emit("market.join", { symbol: joinedSymbol })
    }
  }, [joinedSymbol])

  const handleJoin = () => {
    const nextSymbol = normalizeMarketSymbol(symbolInput)

    if (!nextSymbol) return

    setSymbolInput(nextSymbol)
    setJoinedSymbol(nextSymbol)

    if (nextSymbol === joinedSymbol) {
      socketRef.current?.emit("market.join", { symbol: nextSymbol })
    }
  }

  const handleReconnect = () => {
    setStatus("connecting")
    socketRef.current?.connect()
  }

  const handleDisconnect = () => {
    socketRef.current?.disconnect()
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 border-b border-border pb-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-foreground/40 uppercase">
              Socket monitor
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal md:text-3xl">
              Market trade stream
            </h1>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm">
            <span
              className={
                status === "connected"
                  ? "h-2.5 w-2.5 rounded-full bg-emerald-500"
                  : status === "connecting"
                    ? "h-2.5 w-2.5 rounded-full bg-amber-500"
                    : "h-2.5 w-2.5 rounded-full bg-red-500"
              }
            />
            <span className="font-medium capitalize">{status}</span>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground/50">
                  Market symbol
                </span>
                <input
                  value={symbolInput}
                  onChange={(event) => setSymbolInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleJoin()
                  }}
                  className="h-11 rounded-md border border-border bg-background px-3 font-mono text-sm outline-none focus:border-foreground/40"
                />
              </label>

              <button
                type="button"
                onClick={handleJoin}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background sm:self-end"
              >
                <Cable size={16} />
                Join
              </button>
            </div>

            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-md border border-border bg-background p-3">
                <dt className="text-foreground/50">Gateway</dt>
                <dd className="mt-1 truncate font-mono">{WS_URL}</dd>
              </div>
              <div className="rounded-md border border-border bg-background p-3">
                <dt className="text-foreground/50">Room</dt>
                <dd className="mt-1 font-mono">market:{joinedSymbol}</dd>
              </div>
              <div className="rounded-md border border-border bg-background p-3">
                <dt className="text-foreground/50">Socket ID</dt>
                <dd className="mt-1 truncate font-mono">{socketId ?? "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Activity size={18} />
                <span className="text-sm font-semibold">Latest trade</span>
              </div>
              <span className="rounded-md border border-border px-2 py-1 font-mono text-xs">
                {events.length} events
              </span>
            </div>

            <div className="mt-5">
              <p className="text-4xl font-semibold tabular-nums">
                {formatPrice(latestPayload?.lastPrice ?? latestTrade?.price)}
                <span className="ml-1 text-base font-normal text-foreground/40">
                  USDT
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-foreground/60">
                <span className="rounded-md bg-background px-2 py-1 font-mono">
                  {latestPayload?.symbol ??
                    latestPayload?.marketId ??
                    joinedSymbol}
                </span>
                <span className="rounded-md bg-background px-2 py-1">
                  Qty{" "}
                  {latestPayload?.totalQuantity ?? latestTrade?.quantity ?? "—"}
                </span>
                <span className="rounded-md bg-background px-2 py-1">
                  {latestEvent?.receivedAt ?? "No event"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Controls</h2>
              <CircleDot size={16} className="text-foreground/50" />
            </div>

            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={handleReconnect}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-medium"
              >
                <PlugZap size={16} />
                Reconnect
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-medium"
              >
                <Unplug size={16} />
                Disconnect
              </button>
              <button
                type="button"
                onClick={() => setEvents([])}
                className="h-10 rounded-md border border-border bg-background text-sm font-medium"
              >
                Clear events
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold">Event log</h2>
            </div>

            <div className="max-h-[420px] overflow-auto">
              {events.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-foreground/50">
                  Waiting for market.trade.created
                </p>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="border-b border-border px-4 py-3 last:border-b-0"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs text-foreground/50">
                      <span>{event.receivedAt}</span>
                      <span className="font-mono">
                        {event.payload.symbol ?? event.payload.marketId}
                      </span>
                    </div>
                    <pre className="overflow-x-auto rounded-md bg-background p-3 text-xs leading-relaxed">
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
