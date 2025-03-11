"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const traceability_1 = require("traceability");
const util_helper_1 = require("../helpers/util.helper");
class HttpClient {
    constructor(serviceName) {
        this.serviceName = serviceName;
    }
    handlerRequestError(ex, serviceName, methodName) {
        const error = {
            serviceName,
            isAxiosError: true,
            message: 'Ops! Unexpected error 🚩, please contact tech team! {Useful information: happened in HttpClient}',
        };
        if (!ex.request) {
            traceability_1.Logger.error(JSON.stringify({
                message: `Problem setting up the content of request`,
                additional: 'Request was not made',
                eventName: `${serviceName}.${methodName}`,
                errorMessage: ex.message,
            }));
            return error;
        }
        const { method, path } = ex.request;
        if (ex.request && !ex.response) {
            traceability_1.Logger.error(JSON.stringify({
                message: `HTTP Client - METHOD: ${method}, PATH: ${path}`,
                additional: 'Request was made and there is not response',
                eventName: `${serviceName}.${methodName}`,
                errorMessage: ex.message,
            }));
        }
        if (ex.response) {
            const { data, status, statusText } = ex.response;
            error.status = status;
            error.data = data;
            if (status != 404) {
                traceability_1.Logger.error(JSON.stringify({
                    message: `HTTP Client - METHOD: ${method}, PATH: ${path}`,
                    code: status,
                    statusText: statusText,
                    additional: 'Request was made and response is not 2xx',
                    eventName: `${serviceName}.${methodName}`,
                    error: data,
                }));
            }
        }
        return error;
    }
    async get(methodName, { config, path, query }) {
        try {
            const { cid } = traceability_1.ContextAsyncHooks.getTrackId();
            if (config === null || config === void 0 ? void 0 : config.userAuth) {
                config.userAuth = JSON.stringify(config === null || config === void 0 ? void 0 : config.userAuth);
            }
            const result = await axios_1.default.get(path, (0, util_helper_1.toObject)({
                params: { ...query },
                headers: { cid: String(cid), ...config },
                validateStatus: (status) => status >= 200 && status <= 399,
            }));
            return {
                status: result.status,
                data: result.data,
                headers: result.headers,
            };
        }
        catch (ex) {
            return this.handlerRequestError(ex, this.serviceName, methodName);
        }
    }
    async post(methodName, { config, path, query, body }) {
        try {
            const { cid } = traceability_1.ContextAsyncHooks.getTrackId();
            if (config === null || config === void 0 ? void 0 : config.userAuth) {
                config.userAuth = JSON.stringify(config === null || config === void 0 ? void 0 : config.userAuth);
            }
            const result = await axios_1.default.post(path, (0, util_helper_1.toObject)(body), (0, util_helper_1.toObject)({
                params: { ...query },
                headers: { cid: String(cid), ...config },
            }));
            return {
                status: result.status,
                data: result.data,
                headers: result.headers,
            };
        }
        catch (ex) {
            return this.handlerRequestError(ex, this.serviceName, methodName);
        }
    }
    async put(methodName, { config, path, query, body }) {
        try {
            const { cid } = traceability_1.ContextAsyncHooks.getTrackId();
            if (config === null || config === void 0 ? void 0 : config.userAuth) {
                config.userAuth = JSON.stringify(config === null || config === void 0 ? void 0 : config.userAuth);
            }
            const result = await axios_1.default.put(path, (0, util_helper_1.toObject)(body), (0, util_helper_1.toObject)({
                params: { ...query },
                headers: { cid: String(cid), ...config },
            }));
            return {
                status: result.status,
                data: result.data,
                headers: result.headers,
            };
        }
        catch (ex) {
            return this.handlerRequestError(ex, this.serviceName, methodName);
        }
    }
    async patch(methodName, { config, path, query, body }) {
        try {
            const { cid } = traceability_1.ContextAsyncHooks.getTrackId();
            if (config === null || config === void 0 ? void 0 : config.userAuth) {
                config.userAuth = JSON.stringify(config === null || config === void 0 ? void 0 : config.userAuth);
            }
            const result = await axios_1.default.patch(path, (0, util_helper_1.toObject)(body), (0, util_helper_1.toObject)({
                params: { ...query },
                headers: { cid: String(cid), ...config },
            }));
            return {
                status: result.status,
                data: result.data,
                headers: result.headers,
            };
        }
        catch (ex) {
            return this.handlerRequestError(ex, this.serviceName, methodName);
        }
    }
    async delete(methodName, { config, path, query }) {
        try {
            const { cid } = traceability_1.ContextAsyncHooks.getTrackId();
            if (config === null || config === void 0 ? void 0 : config.userAuth) {
                config.userAuth = JSON.stringify(config === null || config === void 0 ? void 0 : config.userAuth);
            }
            const result = await axios_1.default.delete(path, (0, util_helper_1.toObject)({
                params: { ...query },
                headers: { cid: String(cid), ...config },
            }));
            return {
                status: result.status,
                data: result.data,
                headers: result.headers,
            };
        }
        catch (ex) {
            return this.handlerRequestError(ex, this.serviceName, methodName);
        }
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=httpClient.js.map