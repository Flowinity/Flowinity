// The client satisfies object determines what the client can handle based on version in the header
// This is to avoid breaking changes in the future resulting in a fatal error on the client
import semver from "semver"

export type ClientSatisfies = {
  nameColor: boolean
  uptime: boolean
}

export function generateClientSatisfies(
  client: string,
  version: string
): ClientSatisfies {
  try {
    const clientSatisfies: ClientSatisfies = {
      nameColor: false,
      uptime: false
    }

    if (client === "TPUvNEXT") {
      if (semver.gte(version, "3.2.51")) {
        clientSatisfies.nameColor = true
        clientSatisfies.uptime = true
      }
    }

    return clientSatisfies
  } catch {
    return {
      nameColor: false,
      uptime: false
    }
  }
}
