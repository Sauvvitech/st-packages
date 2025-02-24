"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumer = void 0;
const traceability_1 = require("traceability");
const { randomUUID } = require('crypto');
const graceful_shutdown_1 = require("../../../graceful-shutdown");
class KafkaConsumer {
    constructor(kafkaInstance, consumerConfig) {
        this.kafkaInstance = kafkaInstance;
        this.consumerConfig = consumerConfig;
    }
    async consume({ topicsHandlers, fromBeginning, }) {
        var _a, _b, _c;
        await this.start();
        const topics = topicsHandlers.map((th) => th.topic);
        (_a = this.consumer) === null || _a === void 0 ? void 0 : _a.subscribe({ topics, fromBeginning });
        await ((_b = this.consumer) === null || _b === void 0 ? void 0 : _b.run({
            eachMessage: async ({ message: messageBuffer, heartbeat, partition, topic, }) => {
                var _a;
                const key = messageBuffer.key.toString();
                const value = this.parseBufferToObject(messageBuffer.value);
                const headers = messageBuffer.headers;
                try {
                    const cid = ((_a = headers === null || headers === void 0 ? void 0 : headers.cid) === null || _a === void 0 ? void 0 : _a.toString()) || randomUUID();
                    traceability_1.ContextAsyncHooks.setContext({ cid });
                    const topicHandler = topicsHandlers.find((th) => th.topic === topic);
                    await (topicHandler === null || topicHandler === void 0 ? void 0 : topicHandler.handler({
                        message: value,
                        key,
                        heartbeat,
                        topic,
                        partition,
                        headers,
                    }));
                }
                catch (error) {
                    traceability_1.Logger.error(error);
                }
            },
        }));
        (_c = this.consumer) === null || _c === void 0 ? void 0 : _c.on('consumer.crash', () => {
            process.kill(process.pid, graceful_shutdown_1.ProcessEventsGracefulShutdownEnum.SIGTERM);
        });
    }
    async start() {
        var _a;
        this.consumer = this.kafkaInstance.consumer(this.consumerConfig);
        this.registerListener();
        await ((_a = this.consumer) === null || _a === void 0 ? void 0 : _a.connect());
    }
    parseBufferToObject(message) {
        return JSON.parse(message.toString());
    }
    async shutdown() {
        var _a;
        await ((_a = this.consumer) === null || _a === void 0 ? void 0 : _a.disconnect());
    }
    registerListener() {
        var _a, _b, _c;
        (_a = this.consumer) === null || _a === void 0 ? void 0 : _a.on(this.consumer.events.CONNECT, () => {
            traceability_1.Logger.info('Consumer Connected', {
                eventName: `KafkaConsumer.registerListener.CONNECT`,
            });
        });
        (_b = this.consumer) === null || _b === void 0 ? void 0 : _b.on(this.consumer.events.DISCONNECT, () => {
            traceability_1.Logger.warn('Consumer Disconnected', {
                eventName: `KafkaConsumer.registerListener.DISCONNECT`,
            });
        });
        (_c = this.consumer) === null || _c === void 0 ? void 0 : _c.on(this.consumer.events.REQUEST_TIMEOUT, (data) => {
            traceability_1.Logger.warn('Consumer Timeout', {
                eventName: `KafkaConsumer.registerListener.REQUEST_TIMEOUT`,
                eventData: data,
            });
        });
    }
}
exports.KafkaConsumer = KafkaConsumer;
//# sourceMappingURL=kafkaConsumer.js.map