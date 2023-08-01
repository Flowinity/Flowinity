// TODO: Implement Steam Provider

import { Service } from "typedi"
import axios from "axios"

// Import Lib
import Errors from "@app/lib/errors"

// Import Models
import { Integration } from "@app/models/integration.model"

@Service()
export class SteamService {
  constructor() {}

  async link(userId: string, token: string) {
    if (!config.providers.steam)
      throw Errors.INTEGRATION_PROVIDER_NOT_CONFIGURED
  }
}
