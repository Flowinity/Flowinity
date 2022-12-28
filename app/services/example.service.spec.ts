import { DateService } from '@app/services/date.service';
import { ExampleService } from '@app/services/example.service';
import { Message } from '@common/message';
import { expect } from 'chai';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

describe('Example service', () => {
    let exampleService: ExampleService;
    let dateService: SinonStubbedInstance<DateService>;

    beforeEach(async () => {
        dateService = createStubInstance(DateService);
        dateService.currentTime.resolves({
            title: 'Time',
            body: new Date().toString(),
        });
        exampleService = new ExampleService(dateService);
    });

    it('should return a simple message if #about is called', () => {
        const expectedTitle = 'Basic Server About Page';
        const expectedBody = 'Try calling /api/docs to get the documentation';
        const aboutMessage = exampleService.about();
        expect(aboutMessage.title).to.equals(expectedTitle);
        expect(aboutMessage.body).to.equals(expectedBody);
    });

    it('should return Hello World as title', (done: Mocha.Done) => {
        exampleService.helloWorld().then((result: Message) => {
            expect(result.title).to.equals('Hello world');
            done();
        });
    });

    it('should have a body that starts with "Time is"', (done: Mocha.Done) => {
        exampleService.helloWorld().then((result: Message) => {
            expect(result.body)
                .to.be.a('string')
                .and.satisfy((body: string) => body.startsWith('Time is'));
            done();
        });
    });

    it('should handle an error from DateService', async () => {
        dateService.currentTime.returns(Promise.reject(new Error('error in the service')));
        const message = await exampleService.helloWorld();
        expect(message.title).to.equals('Error');
    });

    it('should store a message', (done: Mocha.Done) => {
        const newMessage: Message = { title: 'Hello', body: 'World' };
        exampleService.storeMessage(newMessage);
        expect(exampleService.clientMessages[0]).to.equals(newMessage);
        done();
    });

    it('should get all messages', (done: Mocha.Done) => {
        const newMessage: Message = { title: 'Hello', body: 'World' };
        const newMessage2: Message = { title: 'Hello', body: 'Again' };
        exampleService.clientMessages.push(newMessage);
        exampleService.clientMessages.push(newMessage2);
        const messages = exampleService.getAllMessages();
        expect(messages).to.equals(exampleService.clientMessages);
        done();
    });
});
