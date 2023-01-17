import { Service } from "typedi"

@Service()
export class AutoCollectService {
  async getAutoCollects(): Promise<any> {
    return []
  }
}
