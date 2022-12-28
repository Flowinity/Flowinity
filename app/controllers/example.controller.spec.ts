import { Application } from '@app/app';
import { ExampleService } from '@app/services/example.service';
import { Message } from '@common/message';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_CREATED = StatusCodes.CREATED;

describe('ExampleController', () => {
    const baseMessage = { title: 'Hello world', body: 'anything really' } as Message;
    let exampleService: SinonStubbedInstance<ExampleService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        exampleService = createStubInstance(ExampleService);
        exampleService.helloWorld.resolves(baseMessage);
        exampleService.about.returns(baseMessage);
        exampleService.getAllMessages.returns([baseMessage, baseMessage]);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['exampleController'], 'exampleService', { value: exampleService });
        expressApp = app.app;
    });

    it('should return message from example service on valid get request to root', async () => {
        return supertest(expressApp)
            .get('/api/example')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal(baseMessage);
            });
    });

    it('should return message from example service on valid get request to about route', async () => {
        const aboutMessage = { ...baseMessage, title: 'About' };
        exampleService.about.returns(aboutMessage);
        return supertest(expressApp)
            .get('/api/example/about')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal(aboutMessage);
            });
    });

    it('should store message in the array on valid post request to /send', async () => {
        const message: Message = { title: 'Hello', body: 'World' };
        return supertest(expressApp).post('/api/example/send').send(message).set('Accept', 'application/json').expect(HTTP_STATUS_CREATED);
    });

    it('should return an array of messages on valid get request to /all', async () => {
        exampleService.getAllMessages.returns([baseMessage, baseMessage]);
        return supertest(expressApp)
            .get('/api/example/all')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal([baseMessage, baseMessage]);
            });
    });
});
