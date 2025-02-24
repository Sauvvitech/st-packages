import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
export declare class GracefulShutdownManager {
    private readonly server?;
    private connections;
    private nextConnectionId;
    private terminating;
    constructor(server?: (HttpServer | HttpsServer) | undefined);
    handleTerminateServer(callback: () => void): void;
    handleTerminate(callback: () => void): void;
    terminateServer(callback: () => void): void;
    private startWatchingServer;
    private startWatchingProcess;
    private onConnection;
    private onRequest;
    private closeIdleConnection;
}
