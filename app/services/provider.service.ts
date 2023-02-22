import { Service } from "typedi"
import axios from "axios"

@Service()
export class ProviderService {
  constructor() {}

  async tenor(search: string, next: string | undefined = undefined) {
    const { data } = await axios.get(
      `https://tenor.googleapis.com/v2/search?q=${search}&key=${config.providers.tenor}&limit=20&pos=${next}`
    )
    return data
  }
}
