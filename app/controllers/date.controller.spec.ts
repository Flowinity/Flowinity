import { Application } from '@app/app';
import { DateService } from '@app/services/date.service';
import { Message } from '@common/message';
import * as chai from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;

describe('DateController', () => {
    let dateService: SinonStubbedInstance<DateService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        dateService = createStubInstance(DateService);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['dateController'], 'dateService', { value: dateService, writable: true });
        expressApp = app.app;
    });

    it('should return time from DateService on get request', async () => {
        const expectedMessage: Message = { title: 'Time', body: new Date().toString() };
        dateService.currentTime.resolves(expectedMessage);

        return supertest(expressApp)
            .get('/api/date')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal(expectedMessage);
            });
    });

    it('should return an error as a message on service fail', async () => {
        dateService.currentTime.rejects(new Error('service error'));

        return supertest(expressApp)
            .get('/api/date')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                chai.expect(response.body.title).to.equal('Error');
            });
    });
});
