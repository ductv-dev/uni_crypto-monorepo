export type MatchingRuntimeConfig = {
  matchingMarket: string
  matchingQueue: string
  rabbitmqUrl: string
  rabbitmqExchange: string
  databaseUrl: string
  routingKey: string
}

export const normalizeMarketSymbol = (market: string) =>
  market.trim().toUpperCase().replace(/[\/_]/g, "-").replace(/\s+/g, "")

const getRequiredEnv = (key: string) => {
  const value = process.env[key]?.trim()
  if (!value) {
    throw new Error(
      `[MatchingEngineConfig] Missing required environment variable: ${key}`
    )
  }

  return value
}

export const getMatchingConfig = (): MatchingRuntimeConfig => {
  const matchingMarket = normalizeMarketSymbol(
    getRequiredEnv("MATCHING_MARKET")
  )
  const matchingQueue = getRequiredEnv("MATCHING_QUEUE")
  const rabbitmqUrl = getRequiredEnv("RABBITMQ_URL")
  const rabbitmqExchange = getRequiredEnv("RABBITMQ_EXCHANGE")
  const databaseUrl = getRequiredEnv("DATABASE_URL")

  return {
    matchingMarket,
    matchingQueue,
    rabbitmqUrl,
    rabbitmqExchange,
    databaseUrl,
    routingKey: `order.created.${matchingMarket}`,
  }
}
