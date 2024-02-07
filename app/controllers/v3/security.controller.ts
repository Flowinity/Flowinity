import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParam
} from "routing-controllers"
import { Service } from "typedi"
import { Auth } from "@app/lib/auth"
import { User } from "@app/models/user.model"
import { SecurityService } from "@app/services/security.service"

@Service()
@JsonController("/security")
export class SecurityControllerV3 {
  constructor(private readonly securityService: SecurityService) {}

  @Get("/audit")
  async getAuditLog(
    @Auth("*") user: User,
    @QueryParam("page") page: number = 1
  ) {
    return await this.securityService.getAuditLog(user.id, page)
  }

  @Get("/keys")
  async getAPIKeys(@Auth("*") user: User) {
    return await this.securityService.getKeys(user.id)
  }

  @Delete("/keys/:id")
  async deleteAPIKey(@Auth("*") user: User, @Param("id") id: string) {
    await this.securityService.deleteKey(user.id, id)
  }

  @Post("/keys")
  async createAPIKey(
    @Auth("*") user: User,
    @Body()
    body: {
      name: string
      scopes: string[]
      expiry?: Date
    }
  ) {
    return await this.securityService.createKey(user.id, body.name, body.scopes)
  }

  @Get("/logins")
  async getLogins(@Auth("*") user: User) {
    return await this.securityService.getSessions(user.id)
  }

  @Get("/passwords")
  async getScopedPasswords(@Auth("*") user: User) {
    return await this.securityService.getAlternatePasswords(user.id)
  }

  @Post("/passwords")
  async createScopedPassword(
    @Auth("*") user: User,
    @Body()
    body: {
      password: string
      scopes: string[]
      name: string
      totp: boolean
    }
  ) {
    await this.securityService.createAlternatePassword(
      user.id,
      body.password,
      body.scopes,
      body.name,
      body.totp
    )
  }

  @Patch("/passwords")
  async deleteScopedPassword(
    @Auth("*") user: User,
    @Body()
    body: {
      name: string
    }
  ) {
    await this.securityService.deleteAlternatePassword(user.id, body.name)
  }
}
