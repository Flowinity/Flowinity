import { DateService } from '@app/services/date.service';
import { expect } from 'chai';
import { SinonFakeTimers, useFakeTimers } from 'sinon';
import { Container } from 'typedi';

describe('Date Service', () => {
    let dateService: DateService;
    let clock: SinonFakeTimers;

    beforeEach(async () => {
        dateService = Container.get(DateService);
        clock = useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it('currentTime should return a valid message', async () => {
        const result = await dateService.currentTime();
        expect(result.title).to.equal('Time');
        expect(result.body).to.equal(new Date(0).toString());
    });

    it('currentTime should return different dates if called later', async () => {
        const { body: currentTime } = await dateService.currentTime();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        clock.tick(5000);
        const { body: now } = await dateService.currentTime();
        expect(new Date(currentTime)).to.be.below(new Date(now));
    });
});
