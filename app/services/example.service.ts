import { DateService } from '@app/services/date.service';
import { Message } from '@common/message';
import { Service } from 'typedi';

@Service()
export class ExampleService {
    clientMessages: Message[];
    constructor(private readonly dateService: DateService) {
        this.clientMessages = [];
    }

    about(): Message {
        return {
            title: 'Basic Server About Page',
            body: 'Try calling /api/docs to get the documentation',
        };
    }

    async helloWorld(): Promise<Message> {
        return this.dateService
            .currentTime()
            .then((timeMessage: Message) => {
                return {
                    title: 'Hello world',
                    body: 'Time is ' + timeMessage.body,
                };
            })
            .catch((error: unknown) => {
                return {
                    title: 'Error',
                    body: error as string,
                };
            });
    }

    // TODO : ceci est à titre d'exemple. À enlever pour la remise
    storeMessage(message: Message): void {
        // eslint-disable-next-line no-console
        console.log(message);
        this.clientMessages.push(message);
    }

    getAllMessages(): Message[] {
        return this.clientMessages;
    }
}
