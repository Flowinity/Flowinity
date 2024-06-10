import { init } from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node"

const config = process.env.CONFIG
  ? JSON.parse(process.env.CONFIG || "{}")
  : require(global.appRoot + "/config/tpu.json")

if (!config.sentry?.dsn) {
  console.warn("Sentry DSN not provided, skipping Sentry initialization")
} else {
  init({
    dsn: config.sentry.dsn,
    integrations: [nodeProfilingIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0 //  Capture 100% of the transactions
  })
}
