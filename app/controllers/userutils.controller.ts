import { UserUtilsService } from "@app/services/userutils.service";
import { Request, Response, Router } from "express";
import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";

//const HTTP_STATUS_CREATED = 201;

@Service()
export class UserUtilsController {
  router: Router;

  constructor(private readonly userUtilsService: UserUtilsService) {
    this.configureRouter();
  }

  private configureRouter(): void {
    this.router = Router();

    this.router.get("/inviteV2/:key", async (req: Request, res: Response) => {
      // Send the request to the service and send the response
      try {
        const invite = this.userUtilsService.getInvite(req.params.key);
        res.json(invite);
      } catch {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
      }
    });
  }
}
