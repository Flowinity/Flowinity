import {NextFunction, Response} from "express"
import {ExpressMiddlewareInterface, Middleware} from "routing-controllers"
import {Container, Service} from "typedi"

// Import Libs
import Errors from "@app/lib/errors"

// Import Services
import {CoreService} from "@app/services/core.service"

// Import Types
import {RequestAuth} from "@app/types/express"

@Service()
@Middleware({type: "before"})
export default class ExperimentValidator implements ExpressMiddlewareInterface {
    private readonly experiment: string

    constructor(experiment: string) {
        this.experiment = experiment
    }

    async use(
        req: RequestAuth,
        res: Response,
        next: NextFunction
    ) {
        const coreService: CoreService = Container.get(CoreService)

        if (
            await coreService.checkExperiment(
                req.user.id,
                this.experiment,
                req.user.administrator || req.user.moderator
            )
        )
            return next()

        throw Errors.EXPERIMENT_NOT_ALLOWED
    }
}
