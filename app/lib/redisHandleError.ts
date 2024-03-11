export function redisHandleError(e: any): void {
  try {
    if (config?.redis?.host === "defaulthostname") {
      console.log(
        "Suppressed 1 Redis error as Flowinity Server is not yet configured."
      )
    } else {
      console.error(e)
    }
  } catch (e) {
    console.log(
      "Suppressed 1 Redis error as Flowinity Server is not yet configured."
    )
  }
}
