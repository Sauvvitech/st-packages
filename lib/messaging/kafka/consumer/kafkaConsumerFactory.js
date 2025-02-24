"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumerFactory = void 0;
const kafkaConnectionConsumerSingleton_1 = require("./kafkaConnectionConsumerSingleton");
const kafkaConsumer_1 = require("./kafkaConsumer");
class KafkaConsumerFactory {
    static create(kafkaparams, consumerConfig) {
        const kafkaInstance = kafkaConnectionConsumerSingleton_1.KafkaConnectionConsumerSingleton.getKafkaInstance(kafkaparams);
        const defaultConfigConsumer = {
            groupId: kafkaparams.serviceName,
            allowAutoTopicCreation: true,
            retry: {
                retries: 10,
            },
        };
        return new kafkaConsumer_1.KafkaConsumer(kafkaInstance, {
            ...defaultConfigConsumer,
            ...consumerConfig,
        });
    }
}
exports.KafkaConsumerFactory = KafkaConsumerFactory;
//# sourceMappingURL=kafkaConsumerFactory.js.map