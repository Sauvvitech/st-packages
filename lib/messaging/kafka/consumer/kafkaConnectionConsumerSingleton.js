"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConnectionConsumerSingleton = void 0;
const kafkajs_1 = require("kafkajs");
const kafka_helpers_1 = require("../kafka.helpers");
class KafkaConnectionConsumerSingleton extends kafkajs_1.Kafka {
    constructor({ serviceName, username, password, brokers, logLevel: levelLogging, }) {
        super({
            logLevel: levelLogging || kafkajs_1.logLevel.ERROR,
            clientId: serviceName,
            logCreator: kafka_helpers_1.createLoggerKafkaJs,
            brokers,
            ssl: true,
            sasl: {
                mechanism: 'plain',
                password,
                username,
            },
            connectionTimeout: 45000,
        });
    }
    static getKafkaInstance(kafkaParams) {
        if (!KafkaConnectionConsumerSingleton.kafkaInstance) {
            KafkaConnectionConsumerSingleton.kafkaInstance =
                new KafkaConnectionConsumerSingleton(kafkaParams);
        }
        return KafkaConnectionConsumerSingleton.kafkaInstance;
    }
}
exports.KafkaConnectionConsumerSingleton = KafkaConnectionConsumerSingleton;
//# sourceMappingURL=kafkaConnectionConsumerSingleton.js.map