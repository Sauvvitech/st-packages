import { Logger } from 'traceability';
import axios from 'axios';
import { HttpClient } from './../../index';
import MockAdapter from 'axios-mock-adapter';

const axiosMockAdapter = new MockAdapter(axios);

const loggerSpy = jest
  .spyOn(Logger, 'error')
  .mockReturnValue({} as unknown as typeof Logger);

const config = {
  userAuth: {
    ip: '1.1.1.1',
    id: '12345',
    name: 'name test',
    email: 'email@test.com',
    accessType: 'acessType',
  },
};

const makeSut = () => {
  const serviceName = '__TEST__';
  const httpClient = new HttpClient(serviceName);
  const ex = {
    message: 'Request failed with status code 404',
    name: 'Error',
    stack: 'Error: Request failed with status code 404\n',
    config: {
      transitional: {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false,
      },
      timeout: 0,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      maxContentLength: -1,
      maxBodyLength: -1,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'axios/0.24.0',
      },
      method: 'get',
      url: 'http://localhost:3000/util',
    },
    response: {
      headers: {},
      config: {},
      data: 'responseData',
      status: 401,
      statusText: 'responseStatusText',
    },
    request: {
      host: 'requestHost',
      method: 'requestMethod',
      path: 'requestPath',
    },
    isAxiosError: true,
    toJSON: function (): object {
      throw new Error('Function not implemented.');
    },
  };
  return { ex, httpClient };
};
describe('httpClient', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // ou
    // loggerSpy.mockClear(); // Se preferir resetar só o logger
    axiosMockAdapter.reset();
  });
  describe('handlerRequestError', () => {
    it('must return a IErrorResponse with a default message and the boolean isAxiosError when sended a valid axiosError', async () => {
      const { httpClient, ex } = makeSut();
      const result = httpClient.handlerRequestError(ex, '__TEST__', 'METHOD');

      expect(result.isAxiosError).toBe(true);
      expect(result.message).toBe(
        'Ops! Unexpected error 🚩, please contact tech team! {Useful information: happened in HttpClient}',
      );

      expect(loggerSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledWith(
        '{"message":"HTTP Client - METHOD: requestMethod, PATH: requestPath","code":401,"statusText":"responseStatusText","additional":"Request was made and response is not 2xx","eventName":"__TEST__.METHOD","error":"responseData"}',
      );
    });
    it('must return a IErrorResponse with isAxiosError true when sended a error with a request without response', async () => {
      const { httpClient } = makeSut();
      const ex = {
        request: {
          method: 'GET',
          path: '/default',
        },
      };
      const result = httpClient.handlerRequestError(
        ex as any,
        '__TEST__',
        'METHOD',
      );

      expect(result.isAxiosError).toBe(true);
      expect(result.message).toBe(
        'Ops! Unexpected error 🚩, please contact tech team! {Useful information: happened in HttpClient}',
      );
      expect(loggerSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledWith(
        '{"message":"HTTP Client - METHOD: GET, PATH: /default","additional":"Request was made and there is not response","eventName":"__TEST__.METHOD"}',
      );
    });
    it('must return a IErrorReponse with isAxiosError true when receive a ex without request and response', async () => {
      const { httpClient } = makeSut();
      const ex = new Error('message from error');
      const result = httpClient.handlerRequestError(
        ex as any,
        '__TEST__',
        'METHOD',
      );

      expect(result.isAxiosError).toBe(true);
      expect(result.message).toBe(
        'Ops! Unexpected error 🚩, please contact tech team! {Useful information: happened in HttpClient}',
      );
      expect(loggerSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledWith(
        '{"message":"Problem setting up the content of request","additional":"Request was not made","eventName":"__TEST__.METHOD","errorMessage":"message from error"}',
      );
    });
  });
  describe('get', () => {
    it('must return a IErrorResponse with a default message and the boolean isAxiosError when use the method GET with an invalid path', async () => {
      const { httpClient } = makeSut();
      const result = await httpClient.get('test', {
        path: 'path_test',
        config,
      });
      expect(result.isAxiosError).toBe(true);
      expect(result.message).toBe(
        'Ops! Unexpected error 🚩, please contact tech team! {Useful information: happened in HttpClient}',
      );

      ('{"message":"HTTP Client - METHOD: undefined, PATH: undefined","code":500,"eventName":"__TEST__.METHOD"}');
    });
    it('must return a object with a status and data when use the method GET with a valid request', async () => {
      jest.spyOn(axios, 'get').mockReturnValueOnce({
        status: 200,
        data: [],
      } as any);

      const { httpClient } = makeSut();
      const result = await httpClient.get('test', {
        path: 'path_test',
        config,
      });
      expect(result).toEqual(
        expect.objectContaining({
          status: 200,
          data: [],
        }),
      );
    });
    it('should resolve for status 302 on the GET method', async () => {
      const path = 'path_test';
      axiosMockAdapter.onGet(path).reply(302);

      const { httpClient } = makeSut();
      const result = await httpClient.get('test', {
        path,
        config,
      });

      expect(result.status).toBe(302);
      expect(result.isAxiosError).toBe(undefined);
    });
    it('should reject for status 400 on the GET method', async () => {
      const path = 'path_test';
      axiosMockAdapter.onGet(path).reply(400);

      const { httpClient } = makeSut();
      const result = await httpClient.get('test', {
        path,
        config,
      });
      await expect(result).toEqual({
        isAxiosError: true,
        message:
          'Ops! Unexpected error 🚩, please contact tech team! {Useful information: happened in HttpClient}',
        serviceName: '__TEST__',
      });
    });
  });
  describe('post', () => {
    it('must return a IErrorResponse with a default message and the boolean isAxiosError when use the method POST with an invalid path', async () => {
      const { httpClient } = makeSut();
      const result = await httpClient.post('test', {
        path: 'path_test',
        config,
      });
      expect(result.isAxiosError).toBe(true);
      expect(result.message).toBe(
        'Ops! Unexpected error 🚩, please contact tech team! {Useful information: happened in HttpClient}',
      );
      ('{"message":"HTTP Client - METHOD: undefined, PATH: undefined","code":500,"eventName":"__TEST__.METHOD"}');
    });
    it('must return a object with a status and data when use the method POST with a valid request', async () => {
      jest.spyOn(axios, 'post').mockReturnValue({
        status: 200,
        data: {},
      } as any);

      const { httpClient } = makeSut();
      const result = await httpClient.post('test', {
        path: 'path_test',
        config,
      });
      expect(result).toEqual(
        expect.objectContaining({
          status: 200,
          data: {},
        }),
      );
    });
  });
  describe('put', () => {
    it('must return a IErrorResponse with a default message and the boolean isAxiosError when use the method PUT with an invalid path', async () => {
      const { httpClient } = makeSut();
      const result = await httpClient.put('test', {
        path: 'path_test',
        config,
      });
      expect(result.isAxiosError).toBe(true);
      expect(result.message).toBe(
        'Ops! Unexpected error 🚩, please contact tech team! {Useful information: happened in HttpClient}',
      );
      ('{"message":"HTTP Client - METHOD: undefined, PATH: undefined","code":500,"eventName":"__TEST__.METHOD"}');
    });
    it('must return a object with a status and data when use the method PUT with a valid request', async () => {
      jest.spyOn(axios, 'put').mockReturnValue({
        status: 200,
        data: {},
      } as any);

      const { httpClient } = makeSut();
      const result = await httpClient.put('test', {
        path: 'path_test',
        config,
      });
      expect(result).toEqual(
        expect.objectContaining({
          status: 200,
          data: {},
        }),
      );
    });
  });
  describe('delete', () => {
    it('must return a IErrorResponse with a default message and the boolean isAxiosError when use the method DELETE with an invalid path', async () => {
      const { httpClient } = makeSut();
      const result = await httpClient.delete('test', {
        path: 'path_test',
        config,
      });
      expect(result.isAxiosError).toBe(true);
      expect(result.message).toBe(
        'Ops! Unexpected error 🚩, please contact tech team! {Useful information: happened in HttpClient}',
      );
      ('{"message":"HTTP Client - METHOD: undefined, PATH: undefined","code":500,"eventName":"__TEST__.METHOD"}');
    });
    it('must return a object with a status and data when use the method Delete with a valid request', async () => {
      jest.spyOn(axios, 'delete').mockReturnValue({
        status: 200,
        data: {},
      } as any);

      const { httpClient } = makeSut();
      const result = await httpClient.delete('test', {
        path: 'path_test',
        config,
      });
      expect(result).toEqual(
        expect.objectContaining({
          status: 200,
          data: {},
        }),
      );
    });
  });
  describe('patch', () => {
    it('must return a IErrorResponse with a default message and the boolean isAxiosError when use the method PATCH with an invalid path', async () => {
      const { httpClient } = makeSut();
      const result = await httpClient.patch('test', {
        path: 'path_test',
        config,
      });
      expect(result.isAxiosError).toBe(true);
      expect(result.message).toBe(
        'Ops! Unexpected error 🚩, please contact tech team! {Useful information: happened in HttpClient}',
      );
      ('{"message":"HTTP Client - METHOD: undefined, PATH: undefined","code":500,"eventName":"__TEST__.METHOD"}');
    });
    it('must return a object with a status and data when use the method PATCH with a valid request', async () => {
      jest.spyOn(axios, 'patch').mockReturnValue({
        status: 200,
        data: {},
      } as any);

      const { httpClient } = makeSut();
      const result = await httpClient.patch('test', {
        path: 'path_test',
        config,
      });
      expect(result).toEqual(
        expect.objectContaining({
          status: 200,
          data: {},
        }),
      );
    });
  });
});
