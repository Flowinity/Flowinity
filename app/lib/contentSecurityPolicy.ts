import { Domain } from "@app/models/domain.model"
import redisClient from "@app/redis"

export async function generateCSP() {
  if ((await redisClient.exists("csp")) && config.release !== "dev") {
    return (await redisClient.get("csp")) as string
  }
  const domains = await Domain.findAll({
    attributes: ["domain"]
  })

  const csp = `default-src 'self'; media-src ${config.hostnames?.join(" ")} ${
    config.hostname
  } ${domains.map((d) => d.domain).join(" ")}; img-src ${config.hostnames?.join(
    " "
  )} ${config.hostname} ${domains
    .map((d) => d.domain)
    .join(" ")}; style-src 'self'; script-src ${config.hostnames
    ?.map((origin) => {
      return `https://${origin}`
    })
    ?.join(" ")}";`
  redisClient.set("csp", csp, {
    // 30 minutes
    EX: 60 * 30
  })
  return csp
}
