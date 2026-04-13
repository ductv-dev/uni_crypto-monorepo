import { CandlestickData, Time } from "lightweight-charts"

export type GeneratedCandle = CandlestickData<Time>

const createSamplePointGenerator = () => {
  const randomFactor = 25 + Math.random() * 25

  return (index: number) =>
    index *
      (0.5 +
        Math.sin(index / 1) * 0.2 +
        Math.sin(index / 2) * 0.4 +
        Math.sin(index / randomFactor) * 0.8 +
        Math.sin(index / 50) * 0.5) +
    200 +
    index * 2
}

const createCandle = (value: number, time: Time): GeneratedCandle => ({
  time,
  open: value,
  high: value,
  low: value,
  close: value,
})

const updateCandle = (
  candle: GeneratedCandle,
  value: number
): GeneratedCandle => ({
  time: candle.time,
  close: value,
  open: candle.open,
  low: Math.min(candle.low, value),
  high: Math.max(candle.high, value),
})

export function generateData(
  numberOfCandles = 500,
  updatesPerCandle = 5,
  startAt = 100
) {
  const samplePoint = createSamplePointGenerator()
  const date = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0))
  const numberOfPoints = numberOfCandles * updatesPerCandle
  const initialData: GeneratedCandle[] = []
  const realtimeUpdates: GeneratedCandle[] = []

  let lastCandle: GeneratedCandle | null = null
  let previousValue = samplePoint(-1)

  for (let i = 0; i < numberOfPoints; i += 1) {
    if (i % updatesPerCandle === 0) {
      date.setUTCDate(date.getUTCDate() + 1)
    }

    const time = (date.getTime() / 1000) as Time
    let value = samplePoint(i)
    const diff = (value - previousValue) * Math.random()
    value = previousValue + diff
    previousValue = value

    if (i % updatesPerCandle === 0) {
      const candle = createCandle(value, time)
      lastCandle = candle
      if (i >= startAt) {
        realtimeUpdates.push(candle)
      }
      continue
    }

    if (!lastCandle) continue

    const newCandle = updateCandle(lastCandle, value)
    lastCandle = newCandle

    if (i >= startAt) {
      realtimeUpdates.push(newCandle)
    } else if ((i + 1) % updatesPerCandle === 0) {
      initialData.push(newCandle)
    }
  }

  return {
    initialData,
    realtimeUpdates,
  }
}
