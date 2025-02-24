"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducer = void 0;
const kafkajs_1 = require("kafkajs");
const traceability_1 = require("traceability");
const crypto_1 = require("crypto");
const kafka_helpers_1 = require("../kafka.helpers");
class KafkaProducer {
    constructor({ logLevel: levelLogging, serviceName, brokers, password, username, }, producerConfig) {
        var _a;
        this.producerConfig = producerConfig;
        const kafkaInstance = new kafkajs_1.Kafka({
            logLevel: levelLogging || kafkajs_1.logLevel.ERROR,
            clientId: serviceName,
            brokers,
            ssl: true,
            logCreator: kafka_helpers_1.createLoggerKafkaJs,
            sasl: {
                mechanism: 'plain',
                password,
                username,
            },
            retry: {
                initialRetryTime: 100,
                retries: 10,
            },
            connectionTimeout: 45000,
        });
        this.producer = kafkaInstance.producer(this.producerConfig);
        this.registerListener();
        (_a = this.producer) === null || _a === void 0 ? void 0 : _a.connect();
    }
    static getInstance(params, config) {
        if (!KafkaProducer.instance) {
            KafkaProducer.instance = new KafkaProducer(params, config);
        }
        return KafkaProducer.instance;
    }
    async produce({ topic, message, key, headers, }) {
        const value = JSON.stringify(message);
        const { cid } = traceability_1.ContextAsyncHooks.getTrackId();
        headers = { cid, ...headers };
        await this.send(topic, [{ key: key || (0, crypto_1.randomUUID)(), value, headers }]);
    }
    async produceMultipleMessages({ topic, messages, key, headers, }) {
        const { cid } = traceability_1.ContextAsyncHooks.getTrackId();
        const messagesToSend = messages.map((eachMessage) => ({
            key: key || (0, crypto_1.randomUUID)(),
            value: JSON.stringify(eachMessage),
            headers: { cid, ...headers },
        }));
        await this.send(topic, messagesToSend);
    }
    registerListener() {
        var _a, _b, _c;
        (_a = this.producer) === null || _a === void 0 ? void 0 : _a.on(this.producer.events.CONNECT, () => {
            traceability_1.Logger.info('Producer Connected', {
                eventName: `KafkaProducer.registerListener.CONNECT`,
            });
        });
        (_b = this.producer) === null || _b === void 0 ? void 0 : _b.on(this.producer.events.DISCONNECT, () => {
            traceability_1.Logger.warn('Producer Disconnected', {
                eventName: `KafkaProducer.registerListener.DISCONNECT`,
            });
        });
        (_c = this.producer) === null || _c === void 0 ? void 0 : _c.on(this.producer.events.REQUEST_TIMEOUT, (data) => {
            traceability_1.Logger.warn('Producer Timeout', {
                eventName: `KafkaProducer.registerListener.REQUEST_TIMEOUT`,
                eventData: data,
            });
        });
    }
    async send(topic, messages) {
        var _a;
        await ((_a = this.producer) === null || _a === void 0 ? void 0 : _a.send({
            topic,
            messages,
        }));
    }
    convertMessagesValuesToString(messages) {
        return messages.map(({ key, value }) => ({
            key,
            value: JSON.stringify(value),
        }));
    }
    async shutdown() {
        var _a;
        await ((_a = this.producer) === null || _a === void 0 ? void 0 : _a.disconnect());
    }
}
exports.KafkaProducer = KafkaProducer;
KafkaProducer.instance = null;
//# sourceMappingURL=kafkaProducer.js.map