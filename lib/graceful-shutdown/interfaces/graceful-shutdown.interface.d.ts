import Socket = NodeJS.Socket;
export interface ISocketsMap {
    [key: number]: Socket;
}
export declare enum ProcessEventsGracefulShutdownEnum {
    SIGTERM = "SIGTERM",
    SIGINT = "SIGINT",
    UNCAUGHT_EXCEPTION = "uncaughtException",
    UNHANDLED_REJECTION = "unhandledRejection"
}
