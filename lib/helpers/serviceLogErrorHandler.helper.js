"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceLogErrorHandler = void 0;
const types_1 = require("express-openapi-validator/dist/framework/types");
const traceability_1 = require("traceability");
const serviceLogErrorHandler = (error, event) => {
    if (!(error instanceof types_1.HttpError)) {
        traceability_1.Logger.error(error.message, event);
    }
};
exports.serviceLogErrorHandler = serviceLogErrorHandler;
//# sourceMappingURL=serviceLogErrorHandler.helper.js.map