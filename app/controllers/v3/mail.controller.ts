import {Get, JsonController, Params} from "routing-controllers"
import {Service} from "typedi"
import {Auth} from "@app/lib/auth"
import {User} from "@app/models/user.model"
import Errors from "@app/lib/errors"
import {MailService} from "@app/services/mail.service"
import {CoreService} from "@app/services/core.service"

@Service()
@JsonController("/mail")
export class MailControllerV3 {
  constructor(
    private readonly mailService: MailService,
    private readonly coreService: CoreService
  ) {
  }

  async checkExperiment(user: User, experiment: string) {
    if (
      !user ||
      !(await this.coreService.checkExperiment(
        user.id,
        experiment,
        user.administrator || user.moderator
      )) ||
      !config.officialInstance
    ) {
      throw Errors.EXPERIMENT_NOT_ALLOWED
    }
  }

  @Get("/mailboxes")
  async getMailboxes(@Auth("mail.view") user: User) {
    await this.checkExperiment(user, "WEBMAIL")
    return await this.mailService.getMailboxes(user.id)
  }

  @Get("/mailbox/:mailbox/:page?")
  async getEmails(
    @Auth("mail.view") user: User,
    @Params() {mailbox, page}: { mailbox: string; page?: number }
  ) {
    await this.checkExperiment(user, "WEBMAIL")
    return await this.mailService.getMessages(user.id, mailbox, page)
  }

  @Get("/message/:mailbox/:uid")
  async getEmail(
    @Auth("mail.view") user: User,
    @Params() {mailbox, uid}: { mailbox: string; uid: string }
  ) {
    await this.checkExperiment(user, "WEBMAIL")
    return await this.mailService.getMessage(user.id, mailbox, uid)
  }
}
