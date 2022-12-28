import { StatusCodes } from 'http-status-codes';

export class HttpException extends Error {
    constructor(message: string, public status: number = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message);
        this.name = 'HttpException';
    }
}
