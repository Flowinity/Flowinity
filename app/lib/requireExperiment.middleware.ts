import { RequestAuth } from "@app/types/express"
import Errors from "@app/lib/errors"
import { Service, Container } from "typedi"
import {
  ExpressMiddlewareInterface,
  Middleware,
  createParamDecorator
} from "routing-controllers"
import { CoreService } from "@app/services/core.service"
import { Scope } from "@app/lib/auth"
import { NextFunction, Response } from "express"

@Service()
@Middleware({ type: "before" })
export default class ExperimentValidator implements ExpressMiddlewareInterface {
  private readonly experiment: string

  constructor(experiment: string) {
    this.experiment = experiment
  }

  async use(req: RequestAuth, res: Response, next: NextFunction) {
    const coreService = Container.get(CoreService)
    if (
      await coreService.checkExperiment(
        req.user.id,
        this.experiment,
        req.user.administrator || req.user.moderator
      )
    ) {
      return next()
    }
    throw Errors.EXPERIMENT_NOT_ALLOWED
  }
}
