import { Get, JsonController } from "routing-controllers"
import { Service } from "typedi"
import { Auth } from "@app/lib/auth"
import { User } from "@app/models/user.model"

import { DomainService } from "@app/services/domain.service"
@Service()
@JsonController("/domains")
export class DomainControllerV3 {
  constructor(private readonly domainService: DomainService) {}

  @Get("")
  async getDomains(@Auth("user.view") user: User) {
    return await this.domainService.getDomains()
  }
}
