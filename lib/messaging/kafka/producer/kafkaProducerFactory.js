"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducerFactory = void 0;
const kafkaProducer_1 = require("./kafkaProducer");
class KafkaProducerFactory {
    static create(kafkaparams, producerConfig) {
        const defaultConfigProducer = {
            allowAutoTopicCreation: false,
            transactionTimeout: 30000,
            retry: {
                retries: 10,
                initialRetryTime: 110,
            },
        };
        return kafkaProducer_1.KafkaProducer.getInstance(kafkaparams, {
            ...defaultConfigProducer,
            ...producerConfig,
        });
    }
}
exports.KafkaProducerFactory = KafkaProducerFactory;
//# sourceMappingURL=kafkaProducerFactory.js.map