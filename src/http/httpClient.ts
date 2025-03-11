import axios from 'axios';
import { ContextAsyncHooks, Logger } from 'traceability';
import { toObject } from '../helpers/util.helper';

import {
  IResponse,
  IHttpClient,
  IRequestData,
  IErrorResponse,
} from './httpClient.interface';

export class HttpClient implements IHttpClient {
  public serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  handlerRequestError(
    ex: any,
    serviceName: string,
    methodName: string,
  ): IErrorResponse {
    const error: IErrorResponse = {
      serviceName,
      isAxiosError: true,
      message:
        'Ops! Unexpected error 🚩, please contact tech team! {Useful information: happened in HttpClient}',
    };
    if (!ex.request) {
      Logger.error(
        JSON.stringify({
          message: `Problem setting up the content of request`,
          additional: 'Request was not made',
          eventName: `${serviceName}.${methodName}`,
          errorMessage: ex.message,
        }),
      );
      return error;
    }
    const { method, path } = ex.request;

    if (ex.request && !ex.response) {
      Logger.error(
        JSON.stringify({
          message: `HTTP Client - METHOD: ${method}, PATH: ${path}`,
          additional: 'Request was made and there is not response',
          eventName: `${serviceName}.${methodName}`,
          errorMessage: ex.message,
        }),
      );
    }

    if (ex.response) {
      const { data, status, statusText } = ex.response;

      error.status = status;
      error.data = data;

      if (status != 404) {
        Logger.error(
          JSON.stringify({
            message: `HTTP Client - METHOD: ${method}, PATH: ${path}`,
            code: status,
            statusText: statusText,
            additional: 'Request was made and response is not 2xx',
            eventName: `${serviceName}.${methodName}`,
            error: data,
          }),
        );
      }
    }

    return error;
  }

  async get(
    methodName: string,
    { config, path, query }: IRequestData,
  ): Promise<IResponse | IErrorResponse> {
    try {
      const { cid } = ContextAsyncHooks.getTrackId();
      if (config?.userAuth) {
        config.userAuth = JSON.stringify(config?.userAuth);
      }
      const result = await axios.get(
        path,
        toObject({
          params: { ...query },
          headers: { cid: String(cid), ...config },
          validateStatus: (status: number) => status >= 200 && status <= 399,
        }),
      );

      return {
        status: result.status,
        data: result.data,
        headers: result.headers,
      };
    } catch (ex) {
      return this.handlerRequestError(ex, this.serviceName, methodName);
    }
  }

  async post(
    methodName: string,
    { config, path, query, body }: IRequestData,
  ): Promise<IResponse | IErrorResponse> {
    try {
      const { cid } = ContextAsyncHooks.getTrackId();
      if (config?.userAuth) {
        config.userAuth = JSON.stringify(config?.userAuth);
      }
      const result = await axios.post(
        path,
        toObject(body),
        toObject({
          params: { ...query },
          headers: { cid: String(cid), ...config },
        }),
      );

      return {
        status: result.status,
        data: result.data,
        headers: result.headers,
      };
    } catch (ex) {
      return this.handlerRequestError(ex, this.serviceName, methodName);
    }
  }

  async put(
    methodName: string,
    { config, path, query, body }: IRequestData,
  ): Promise<IResponse | IErrorResponse> {
    try {
      const { cid } = ContextAsyncHooks.getTrackId();
      if (config?.userAuth) {
        config.userAuth = JSON.stringify(config?.userAuth);
      }
      const result = await axios.put(
        path,
        toObject(body),
        toObject({
          params: { ...query },
          headers: { cid: String(cid), ...config },
        }),
      );

      return {
        status: result.status,
        data: result.data,
        headers: result.headers,
      };
    } catch (ex) {
      return this.handlerRequestError(ex, this.serviceName, methodName);
    }
  }

  async patch(
    methodName: string,
    { config, path, query, body }: IRequestData,
  ): Promise<IResponse | IErrorResponse> {
    try {
      const { cid } = ContextAsyncHooks.getTrackId();
      if (config?.userAuth) {
        config.userAuth = JSON.stringify(config?.userAuth);
      }
      const result = await axios.patch(
        path,
        toObject(body),
        toObject({
          params: { ...query },
          headers: { cid: String(cid), ...config },
        }),
      );

      return {
        status: result.status,
        data: result.data,
        headers: result.headers,
      };
    } catch (ex) {
      return this.handlerRequestError(ex, this.serviceName, methodName);
    }
  }

  async delete(
    methodName: string,
    { config, path, query }: IRequestData,
  ): Promise<IResponse | IErrorResponse> {
    try {
      const { cid } = ContextAsyncHooks.getTrackId();
      if (config?.userAuth) {
        config.userAuth = JSON.stringify(config?.userAuth);
      }
      const result = await axios.delete(
        path,
        toObject({
          params: { ...query },
          headers: { cid: String(cid), ...config },
        }),
      );

      return {
        status: result.status,
        data: result.data,
        headers: result.headers,
      };
    } catch (ex) {
      return this.handlerRequestError(ex, this.serviceName, methodName);
    }
  }
}
