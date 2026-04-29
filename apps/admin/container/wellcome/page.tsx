"use client"

import { Iphone } from "@workspace/ui/components/iphone"
import { OrbitingCircles } from "@workspace/ui/components/orbiting-circles"
import {
  Bitcoin,
  ChartNoAxesCombined,
  ChartPie,
  Coins,
  HandCoins,
  Send,
  ShieldCheck,
  TrendingUp,
  WalletCards,
  Zap,
} from "lucide-react"

const STATS = [
  { label: "Người dùng", value: "10M+" },
  { label: "Giao dịch / ngày", value: "2M+" },
  { label: "Tokens", value: "400+" },
]

const FEATURES = [
  { icon: <ShieldCheck size={18} />, text: "Bảo mật cấp ngân hàng" },
  { icon: <Zap size={18} />, text: "Giao dịch tức thì" },
  { icon: <TrendingUp size={18} />, text: "Biểu đồ thời gian thực" },
]

export const Wellcome = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      {/* ── MOBILE ── */}
      <div className="flex min-h-screen flex-col md:hidden">
        {/* Top hero area */}
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
          </div>

          {/* Orbiting circles */}
          <OrbitingCircles iconSize={40} speed={0.3}>
            <span className="rounded-full border border-border bg-card p-2.5 text-yellow-400 shadow-lg backdrop-blur-xl">
              <Bitcoin />
            </span>
            <span className="rounded-full border border-border bg-card p-2.5 text-yellow-400 shadow-lg backdrop-blur-xl">
              <HandCoins />
            </span>
            <span className="rounded-full border border-border bg-card p-2.5 text-yellow-400 shadow-lg backdrop-blur-xl">
              <WalletCards />
            </span>
            <span className="rounded-full border border-border bg-card p-2.5 text-yellow-400 shadow-lg backdrop-blur-xl">
              <Coins />
            </span>
          </OrbitingCircles>

          <OrbitingCircles iconSize={28} radius={100} reverse speed={0.5}>
            <span className="rounded-full border border-primary/30 bg-primary/10 p-2 text-primary backdrop-blur-xl">
              <ChartNoAxesCombined />
            </span>
            <span className="rounded-full border border-primary/30 bg-primary/10 p-2 text-primary backdrop-blur-xl">
              <ChartPie />
            </span>
            <span className="rounded-full border border-primary/30 bg-primary/10 p-2 text-primary backdrop-blur-xl">
              <Send />
            </span>
            <span className="rounded-full border border-primary/30 bg-primary/10 p-2 text-primary backdrop-blur-xl">
              <ShieldCheck />
            </span>
          </OrbitingCircles>

          {/* Center logo text */}
          <div className="z-10 flex flex-col items-center gap-1">
            <span className="text-xs font-semibold tracking-[0.25em] text-primary/70 uppercase">
              Uni Crypto
            </span>
          </div>
        </div>

        {/* Bottom CTA panel */}
        <div className="rounded-t-3xl border-t border-border bg-card/80 px-5 pt-6 pb-10 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Nền tảng crypto{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  duy nhất
                </span>{" "}
                bạn cần
              </h1>
              <p className="mt-1 text-sm text-foreground/50">
                Giao dịch BTC, ETH, BNB và 400+ coin với tỷ giá tốt nhất
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {FEATURES.map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/70"
                >
                  <span className="text-primary">{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-1 flex w-full flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <a
                  href="/login"
                  className="flex h-13 w-full flex-1 items-center justify-center rounded-2xl bg-primary px-6 shadow-lg shadow-primary/30 transition-all active:scale-95"
                >
                  <p className="text-sm font-bold text-primary-foreground">
                    Đăng nhập
                  </p>
                </a>
              </div>
              <a
                href="/register"
                className="flex h-13 w-full items-center justify-center rounded-2xl border border-border bg-background px-6 transition-all active:scale-95"
              >
                <p className="text-sm font-bold text-foreground">
                  Tạo tài khoản
                </p>
              </a>
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-foreground/40">
              Tiếp tục đồng nghĩa với việc bạn chấp nhận{" "}
              <a
                href="#"
                className="font-semibold text-primary/70 underline underline-offset-2"
              >
                Điều khoản dịch vụ
              </a>{" "}
              &amp;{" "}
              <a
                href="#"
                className="font-semibold text-primary/70 underline underline-offset-2"
              >
                Chính sách bảo mật
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="relative hidden min-h-screen items-center md:flex">
        {/* Background */}
        <div className="absolute inset-0 bg-background">
          <div className="absolute top-1/3 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-2/3 right-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between gap-12 px-8 py-16">
          {/* Left — Text */}
          <div className="flex flex-1 flex-col gap-8">
            <div>
              <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
                Uni Crypto Platform
              </p>
              <h1 className="text-5xl leading-tight font-bold tracking-tight text-foreground">
                Nền tảng crypto{" "}
                <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                  duy nhất
                </span>{" "}
                bạn cần
              </h1>
              <p className="mt-4 text-lg text-foreground/60">
                Giao dịch BTC, ETH, BNB và hơn 400 loại tiền điện tử với tỷ giá
                tốt nhất, bảo mật tuyệt đối.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-card/60 px-5 py-4 backdrop-blur-xl"
                >
                  <p className="text-2xl font-bold text-foreground">
                    {s.value}
                  </p>
                  <p className="text-xs text-foreground/50">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Feature list */}
            <div className="flex flex-col gap-3">
              {FEATURES.map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                    {f.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground/70">
                    {f.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex gap-4">
              <a
                href="/login"
                className="flex h-13 items-center justify-center rounded-2xl bg-primary px-8 font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:brightness-110 active:scale-95"
              >
                Đăng nhập
              </a>
              <a
                href="/register"
                className="flex h-13 items-center justify-center rounded-2xl border border-border bg-card px-8 font-bold text-foreground transition-all hover:bg-accent active:scale-95"
              >
                Tạo tài khoản
              </a>
            </div>

            <p className="text-xs text-foreground/40">
              Bằng việc tiếp tục, bạn chấp nhận{" "}
              <a href="#" className="text-primary/70 hover:underline">
                Điều khoản dịch vụ
              </a>{" "}
              &amp;{" "}
              <a href="#" className="text-primary/70 hover:underline">
                Chính sách về quyền riêng tư
              </a>
            </p>
          </div>

          {/* Right — Phone mockup */}
          <div className="relative flex flex-1 items-center justify-center">
            {/* Glow behind phone */}
            <div className="absolute h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative z-10 h-auto w-60">
              <Iphone src="https://i.pinimg.com/1200x/6f/4e/ad/6f4ead9b9aedd1cebaf2cebcc1acf19c.jpg" />
            </div>

            {/* Floating stat cards */}
            <div className="absolute top-16 -left-4 z-20 rounded-2xl border border-border bg-card/80 px-4 py-3 shadow-xl backdrop-blur-xl">
              <p className="text-xs text-foreground/50">BTC/USDT</p>
              <p className="text-base font-bold text-foreground">$67,420</p>
              <p className="text-xs font-semibold text-green-500">+2.34%</p>
            </div>

            <div className="absolute -right-4 bottom-24 z-20 rounded-2xl border border-border bg-card/80 px-4 py-3 shadow-xl backdrop-blur-xl">
              <p className="text-xs text-foreground/50">Portfolio</p>
              <p className="text-base font-bold text-foreground">$10,032</p>
              <p className="text-xs font-semibold text-green-500">+2.20%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
