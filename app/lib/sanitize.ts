function sanitizeIntegrationProviderUserCache(
  type: "discord" | "lastFM" | "mal",
  providerUserCache: any
) {
  switch (type) {
    case "discord":
      delete providerUserCache["email"]
      delete providerUserCache["mfa_verified"]
      return providerUserCache
    case "lastFM":
      return providerUserCache
    case "mal":
      delete providerUserCache["location"]
      delete providerUserCache["birthday"]
      delete providerUserCache["gender"]
      delete providerUserCache["token_type"]
      return providerUserCache
    default:
      return providerUserCache
  }
}

export default {
  sanitizeIntegrationProviderUserCache
}
