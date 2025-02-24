"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GracefulShutdownManager = void 0;
const traceability_1 = require("traceability");
const graceful_shutdown_interface_1 = require("./interfaces/graceful-shutdown.interface");
class GracefulShutdownManager {
    constructor(server) {
        this.server = server;
        this.connections = {};
        this.nextConnectionId = 1;
        this.terminating = false;
        this.startWatchingProcess();
    }
    handleTerminateServer(callback) {
        this.startWatchingServer();
        this.handleTerminate(() => this.terminateServer(callback));
    }
    handleTerminate(callback) {
        process.on(graceful_shutdown_interface_1.ProcessEventsGracefulShutdownEnum.SIGINT, () => {
            traceability_1.Logger.info(`${graceful_shutdown_interface_1.ProcessEventsGracefulShutdownEnum.SIGINT} has been called`);
            callback();
        });
        process.on(graceful_shutdown_interface_1.ProcessEventsGracefulShutdownEnum.SIGTERM, () => {
            traceability_1.Logger.info(`SIGTERM has been called`);
            callback();
        });
    }
    terminateServer(callback) {
        this.terminating = true;
        this.server.close(callback);
        for (const connectionId in this.connections) {
            if (Object.prototype.hasOwnProperty.call(this.connections, connectionId)) {
                const socket = this.connections[connectionId];
                this.closeIdleConnection(socket);
            }
        }
    }
    startWatchingServer() {
        this.server.on('connection', this.onConnection.bind(this));
        this.server.on('request', this.onRequest.bind(this));
    }
    startWatchingProcess() {
        process.on(graceful_shutdown_interface_1.ProcessEventsGracefulShutdownEnum.UNCAUGHT_EXCEPTION, (error, origin) => {
            traceability_1.Logger.error(error.message, {
                eventName: 'GracefulShutdownManager.startWatchingProcess',
                eventData: {
                    origin,
                    processName: graceful_shutdown_interface_1.ProcessEventsGracefulShutdownEnum.UNCAUGHT_EXCEPTION,
                },
            });
        });
        process.on(graceful_shutdown_interface_1.ProcessEventsGracefulShutdownEnum.UNHANDLED_REJECTION, (error) => {
            traceability_1.Logger.error(error.message, {
                eventName: 'GracefulShutdownManager.startWatchingProcess',
                eventData: {
                    processName: graceful_shutdown_interface_1.ProcessEventsGracefulShutdownEnum.UNHANDLED_REJECTION,
                },
            });
        });
    }
    onConnection(connection) {
        const connectionId = this.nextConnectionId++;
        connection.isIdle = true;
        this.connections[connectionId] = connection;
        connection.on('close', () => delete this.connections[connectionId]);
    }
    onRequest(request, response) {
        const connection = request.socket;
        connection.isIdle = false;
        response.on('finish', () => {
            connection.isIdle = true;
            if (this.terminating) {
                this.closeIdleConnection(connection);
            }
        });
    }
    closeIdleConnection(connection) {
        if (connection.isIdle) {
            connection.destroy();
        }
    }
}
exports.GracefulShutdownManager = GracefulShutdownManager;
//# sourceMappingURL=graceful-shutdown.js.map