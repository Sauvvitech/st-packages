"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceLogInfoHandler = void 0;
const traceability_1 = require("traceability");
const serviceLogInfoHandler = (message, event) => {
    traceability_1.Logger.info(message, event);
};
exports.serviceLogInfoHandler = serviceLogInfoHandler;
//# sourceMappingURL=service-log-info-handler.helper.js.map