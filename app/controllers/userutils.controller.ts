import { UserUtilsService } from '@app/services/userutils.service';
import { Message } from '@app/interfaces/message';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';

const HTTP_STATUS_CREATED = 201;

@Service()
export class UserUtilsController {
    router: Router;

    constructor(private readonly userUtilsService: UserUtilsService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/inviteV2/:key', async (req: Request, res: Response) => {
            // Send the request to the service and send the response
            try {
                const invite = this.userUtilsService.getInvite(req.params.key);
                res.json(invite);
            } catch {
                res.sendStatus(StatusCodes.UNAUTHORIZED);
            }
        });

        this.router.get('/about', (req: Request, res: Response) => {
            // Send the request to the service and send the response
            res.json(this.exampleService.about());
        });

        /**
         * @swagger
         *
         * /api/example/send:
         *   post:
         *     description: Send a message
         *     tags:
         *       - Example
         *       - Message
         *     requestBody:
         *         description: message object
         *         required: true
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/Message'
         *             example:
         *               title: Mon Message
         *               body: Je suis envoyé à partir de la documentation!
         *     produces:
         *       - application/json
         *     responses:
         *       201:
         *         description: Created
         */
        this.router.post('/send', (req: Request, res: Response) => {
            const message: Message = req.body;
            this.exampleService.storeMessage(message);
            res.sendStatus(HTTP_STATUS_CREATED);
        });

        /**
         * @swagger
         *
         * /api/example/all:
         *   get:
         *     description: Return all messages
         *     tags:
         *       - Example
         *       - Message
         *     produces:
         *      - application/json
         *     responses:
         *       200:
         *         description: messages
         *         schema:
         *           type: array
         *           items:
         *             $ref: '#/definitions/Message'
         */
        this.router.get('/all', (req: Request, res: Response) => {
            res.json(this.exampleService.getAllMessages());
        });
    }
}
