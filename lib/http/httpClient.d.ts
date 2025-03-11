import { IResponse, IHttpClient, IRequestData, IErrorResponse } from './httpClient.interface';
export declare class HttpClient implements IHttpClient {
    serviceName: string;
    constructor(serviceName: string);
    handlerRequestError(ex: any, serviceName: string, methodName: string): IErrorResponse;
    get(methodName: string, { config, path, query }: IRequestData): Promise<IResponse | IErrorResponse>;
    post(methodName: string, { config, path, query, body }: IRequestData): Promise<IResponse | IErrorResponse>;
    put(methodName: string, { config, path, query, body }: IRequestData): Promise<IResponse | IErrorResponse>;
    patch(methodName: string, { config, path, query, body }: IRequestData): Promise<IResponse | IErrorResponse>;
    delete(methodName: string, { config, path, query }: IRequestData): Promise<IResponse | IErrorResponse>;
}
