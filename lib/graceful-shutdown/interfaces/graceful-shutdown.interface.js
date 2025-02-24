"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessEventsGracefulShutdownEnum = void 0;
var ProcessEventsGracefulShutdownEnum;
(function (ProcessEventsGracefulShutdownEnum) {
    ProcessEventsGracefulShutdownEnum["SIGTERM"] = "SIGTERM";
    ProcessEventsGracefulShutdownEnum["SIGINT"] = "SIGINT";
    ProcessEventsGracefulShutdownEnum["UNCAUGHT_EXCEPTION"] = "uncaughtException";
    ProcessEventsGracefulShutdownEnum["UNHANDLED_REJECTION"] = "unhandledRejection";
})(ProcessEventsGracefulShutdownEnum || (exports.ProcessEventsGracefulShutdownEnum = ProcessEventsGracefulShutdownEnum = {}));
//# sourceMappingURL=graceful-shutdown.interface.js.map