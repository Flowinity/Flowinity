// TODO: Implement Steam Provider

import {Service} from "typedi"

// Import Lib
import Errors from "@app/lib/errors"

// Import Models

@Service()
export class SteamService {
  constructor() {}

  async link(userId: string, token: string) {
    if (!config.providers.steam)
      throw Errors.INTEGRATION_PROVIDER_NOT_CONFIGURED
  }
}
