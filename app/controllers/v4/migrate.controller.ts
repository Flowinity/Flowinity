import { Body, JsonController, Post } from "routing-controllers"
import { Service } from "typedi"
import { Auth } from "@app/lib/auth"
import { User } from "@app/models/user.model"
import { MigrateService } from "@app/services/migrate.service"

@Service()
@JsonController("/migrate")
export class MigrateControllerV4 {
  constructor(private readonly migrateService: MigrateService) {}

  @Post("/colubrina")
  async migrateColubrina(
    @Auth("user.modify") user: User,
    @Body()
    body: {
      username: string
      password: string
    }
  ) {
    await this.migrateService.colubrina(body.username, body.password, user.id)
  }
}
