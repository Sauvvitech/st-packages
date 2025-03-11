import { HttpError } from 'express-openapi-validator/dist/framework/types';
export declare const serviceLogErrorHandler: (error: HttpError | Error, event?: {
    eventName: string;
    eventData?: Object;
}) => void;
