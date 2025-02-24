"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoggerKafkaJs = exports.toWinstonLogLevel = void 0;
const kafkajs_1 = require("kafkajs");
const traceability_1 = require("traceability");
const toWinstonLogLevel = (level) => {
    switch (level) {
        case kafkajs_1.logLevel.ERROR:
        case kafkajs_1.logLevel.NOTHING:
            return 'error';
        case kafkajs_1.logLevel.WARN:
            return 'warn';
        case kafkajs_1.logLevel.INFO:
            return 'info';
        case kafkajs_1.logLevel.DEBUG:
            return 'debug';
        default:
            return 'debug';
    }
};
exports.toWinstonLogLevel = toWinstonLogLevel;
const createLoggerKafkaJs = () => {
    return ({ level, log }) => {
        const { message, groupId, ...extra } = log;
        traceability_1.Logger.log({
            level: (0, exports.toWinstonLogLevel)(level),
            message: `Kafka: ${message} ${groupId}`,
            extra,
        });
    };
};
exports.createLoggerKafkaJs = createLoggerKafkaJs;
//# sourceMappingURL=kafka.helpers.js.map