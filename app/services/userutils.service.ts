import { Service } from "typedi";

@Service()
export class UserUtilsService {
  async getInvite(key: string): Promise<string> {
    return key;
  }
}
