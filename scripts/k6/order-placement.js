import http from "k6/http"
import { check, sleep } from "k6"
import { Counter, Rate, Trend } from "k6/metrics"
import { SharedArray } from "k6/data"

const DEFAULT_BASE_URL = __ENV.BASE_URL || "http://localhost:8080"
const DEFAULT_ORDER_PATH = __ENV.ORDER_PATH || "/buy-sell"
const DEFAULT_REFRESH_PATH = __ENV.REFRESH_PATH || "/auth/refresh"
const DEFAULT_ORDER_TYPE = __ENV.ORDER_TYPE || "limit"
const DEFAULT_EXECUTOR_MODE = __ENV.EXECUTOR_MODE || "ramping-vus"
const DEFAULT_MARKET_IDS = (__ENV.MARKET_IDS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean)

const PRICE_MIN = Number(__ENV.PRICE_MIN || 500800)
const PRICE_MAX = Number(__ENV.PRICE_MAX || 501200)
const PRICE_DECIMALS = Number(__ENV.PRICE_DECIMALS || 2)

const QUANTITY_MIN = Number(__ENV.QUANTITY_MIN || 0.01)
const QUANTITY_MAX = Number(__ENV.QUANTITY_MAX || 1000)
const QUANTITY_DECIMALS = Number(__ENV.QUANTITY_DECIMALS || 4)

const THINK_TIME_MIN_MS = Number(__ENV.THINK_TIME_MIN_MS || 100)
const THINK_TIME_MAX_MS = Number(__ENV.THINK_TIME_MAX_MS || 350)

const orderSuccessRate = new Rate("order_success_rate")
const orderFailureCount = new Counter("order_failure_count")
const orderLatency = new Trend("order_latency_ms", true)
const tokenRefreshSuccessRate = new Rate("token_refresh_success_rate")
const tokenRefreshFailureCount = new Counter("token_refresh_failure_count")

const randomBetween = (min, max) => Math.random() * (max - min) + min

const randomFixedNumber = (min, max, decimals) =>
  Number(randomBetween(min, max).toFixed(decimals))

const randomSide = () => (Math.random() < 0.5 ? "buy" : "sell")

const randomMarketId = () =>
  DEFAULT_MARKET_IDS[Math.floor(Math.random() * DEFAULT_MARKET_IDS.length)]

const think = () => {
  const waitMs = randomBetween(THINK_TIME_MIN_MS, THINK_TIME_MAX_MS)
  sleep(waitMs / 1000)
}

const loadTokens = () => {
  // Ưu tiên truyền JSON trực tiếp qua biến môi trường để tiện chạy CI/CD.
  if (__ENV.TOKENS_JSON) {
    return JSON.parse(__ENV.TOKENS_JSON)
  }

  // Fallback sang file local để chạy dev/local đơn giản hơn.
  return JSON.parse(open("./tokens.json"))
}

const tokens = new SharedArray("test-user-jwts", () => {
  const parsed = loadTokens()

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error(
      "Token pool is empty. Provide TOKENS_JSON or scripts/k6/tokens.json."
    )
  }

  return parsed.map((item, index) => {
    if (typeof item === "string") {
      return {
        label: `user-${index + 1}`,
        access_token: item,
      }
    }

    if (item && typeof item.token === "string") {
      return {
        label: item.label || `user-${index + 1}`,
        access_token: item.token,
        refresh_token:
          typeof item.refresh_token === "string"
            ? item.refresh_token
            : typeof item.refreshToken === "string"
              ? item.refreshToken
              : null,
      }
    }

    if (item && typeof item.access_token === "string") {
      return {
        label: item.label || `user-${index + 1}`,
        access_token: item.access_token,
        refresh_token:
          typeof item.refresh_token === "string"
            ? item.refresh_token
            : typeof item.refreshToken === "string"
              ? item.refreshToken
              : null,
      }
    }

    throw new Error(
      `Invalid token entry at index ${index}. Expected string, { token }, or { access_token }.`
    )
  })
})

if (DEFAULT_MARKET_IDS.length === 0) {
  throw new Error("MARKET_IDS is required. Example: MARKET_IDS=uuid-1,uuid-2")
}

const buildScenario = () => {
  if (DEFAULT_EXECUTOR_MODE === "constant-arrival-rate") {
    return {
      order_placement_constant_rate: {
        executor: "constant-arrival-rate",
        rate: Number(__ENV.RATE || 30),
        timeUnit: __ENV.TIME_UNIT || "1m",
        duration: __ENV.DURATION || "10m",
        preAllocatedVUs: Number(__ENV.PREALLOCATED_VUS || 10),
        maxVUs: Number(__ENV.MAX_VUS || 50),
      },
    }
  }

  return {
    order_placement_ramp: {
      executor: "ramping-vus",
      startVUs: Number(__ENV.START_VUS || 0),
      gracefulRampDown: __ENV.GRACEFUL_RAMP_DOWN || "5s",
      stages: [
        {
          duration: __ENV.RAMP_UP_DURATION || "10s",
          target: Number(__ENV.TARGET_VUS || 100),
        },
        {
          duration: __ENV.STEADY_DURATION || "30s",
          target: Number(__ENV.TARGET_VUS || 100),
        },
        {
          duration: __ENV.RAMP_DOWN_DURATION || "10s",
          target: Number(__ENV.END_VUS || 0),
        },
      ],
    },
  }
}

export const options = {
  scenarios: buildScenario(),
  thresholds: {
    http_req_failed: ["rate<0.05"],
    order_success_rate: ["rate>0.95"],
    http_req_duration: ["p(95)<1500"],
  },
  summaryTrendStats: ["avg", "min", "med", "p(90)", "p(95)", "max"],
}

export function setup() {
  return {
    baseUrl: DEFAULT_BASE_URL,
    orderPath: DEFAULT_ORDER_PATH,
    refreshPath: DEFAULT_REFRESH_PATH,
  }
}

let currentAuth = null

const getAuthForVu = () => {
  if (currentAuth) {
    return currentAuth
  }

  const seedAuth = tokens[(__VU - 1) % tokens.length]
  currentAuth = {
    label: seedAuth.label,
    access_token: seedAuth.access_token,
    refresh_token: seedAuth.refresh_token,
  }

  return currentAuth
}

const buildOrderPayload = (marketId, side, price, quantity) =>
  JSON.stringify({
    market_id: marketId,
    type: DEFAULT_ORDER_TYPE,
    side,
    price,
    quantity,
  })

const placeOrder = (data, auth, marketId, side, payload) =>
  http.post(`${data.baseUrl}${data.orderPath}`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.access_token}`,
    },
    tags: {
      name: "order-placement",
      market_id: marketId,
      side,
      order_type: DEFAULT_ORDER_TYPE,
    },
  })

const refreshAccessToken = (data, auth) => {
  if (!auth.refresh_token) {
    tokenRefreshSuccessRate.add(false)
    tokenRefreshFailureCount.add(1)

    return false
  }

  const response = http.post(`${data.baseUrl}${data.refreshPath}`, null, {
    headers: {
      Authorization: `Bearer ${auth.refresh_token}`,
    },
    tags: {
      name: "auth-refresh",
    },
  })

  const refreshed = check(response, {
    "refresh status is 200": (res) => res.status === 200,
    "refreshed access token exists": (res) => {
      if (res.status !== 200) return false

      try {
        const body = res.json()
        return Boolean(body?.access_token)
      } catch {
        return false
      }
    },
  })

  tokenRefreshSuccessRate.add(refreshed)

  if (!refreshed) {
    tokenRefreshFailureCount.add(1)
    console.error(
      JSON.stringify({
        vu: __VU,
        iteration: __ITER,
        user: auth.label,
        phase: "refresh",
        status: response.status,
        body: response.body,
      })
    )

    return false
  }

  const body = response.json()
  auth.access_token = body.access_token

  return true
}

export default function (data) {
  const auth = getAuthForVu()
  const marketId = randomMarketId()
  const side = randomSide()
  const price = randomFixedNumber(PRICE_MIN, PRICE_MAX, PRICE_DECIMALS)
  const quantity = randomFixedNumber(
    QUANTITY_MIN,
    QUANTITY_MAX,
    QUANTITY_DECIMALS
  )

  const payload = buildOrderPayload(marketId, side, price, quantity)

  let response = placeOrder(data, auth, marketId, side, payload)

  if (response.status === 401 && refreshAccessToken(data, auth)) {
    response = placeOrder(data, auth, marketId, side, payload)
  }

  const success = check(response, {
    "status is 201": (res) => res.status === 201,
    "order id exists": (res) => {
      if (res.status !== 201) return true

      try {
        const body = res.json()
        return Boolean(body && body.id)
      } catch {
        return false
      }
    },
  })

  orderSuccessRate.add(success)
  orderLatency.add(response.timings.duration)

  if (!success) {
    orderFailureCount.add(1)
    console.error(
      JSON.stringify({
        vu: __VU,
        iteration: __ITER,
        user: auth.label,
        status: response.status,
        body: response.body,
      })
    )
  }

  think()
}

export function handleSummary(summary) {
  const iterations = summary.metrics.iterations?.values?.count || 0
  const failedRate = summary.metrics.http_req_failed?.values?.rate || 0
  const successRate = summary.metrics.order_success_rate?.values?.rate || 0
  const latencyP95 = summary.metrics.http_req_duration?.values?.["p(95)"] || 0
  const refreshRate =
    summary.metrics.token_refresh_success_rate?.values?.rate || 0

  return {
    stdout: [
      "",
      "===== k6 Order Placement Summary =====",
      `iterations: ${iterations}`,
      `http_req_failed: ${failedRate}`,
      `order_success_rate: ${successRate}`,
      `token_refresh_success_rate: ${refreshRate}`,
      `p95 latency(ms): ${latencyP95}`,
      "",
    ].join("\n"),
    "scripts/k6/results/order-placement-summary.json": JSON.stringify(
      summary,
      null,
      2
    ),
  }
}
