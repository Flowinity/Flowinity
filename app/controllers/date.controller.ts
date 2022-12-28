import { DateService } from '@app/services/date.service';
import { Message } from '@common/message';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class DateController {
    router: Router;

    constructor(private readonly dateService: DateService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        /**
         * @swagger
         *
         * definitions:
         *   Message:
         *     type: object
         *     properties:
         *       title:
         *         type: string
         *       body:
         *         type: string
         */

        /**
         * @swagger
         * tags:
         *   - name: Time
         *     description: Time endpoints
         */

        /**
         * @swagger
         *
         * /api/date:
         *   get:
         *     description: Return current time
         *     tags:
         *       - Time
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         */
        this.router.get('/', (req: Request, res: Response) => {
            // Send the request to the service and send the response
            this.dateService
                .currentTime()
                .then((time: Message) => {
                    res.json(time);
                })
                .catch((reason: unknown) => {
                    const errorMessage: Message = {
                        title: 'Error',
                        body: reason as string,
                    };
                    res.json(errorMessage);
                });
        });
    }
}
