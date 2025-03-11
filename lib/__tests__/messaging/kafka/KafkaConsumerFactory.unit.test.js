"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const crypto_1 = __importDefault(require("crypto"));
const kafkaConsumer_1 = require("../../../messaging/kafka/consumer/kafkaConsumer");
const kafka_1 = require("../../../messaging/kafka");
jest.mock('kafkajs');
describe('KafkaConsumerFactory tests', () => {
    let kafka;
    let kafkaConsumer;
    let mockConsumer;
    const brokerUrl = 'lss-2314yp.us-east-1.cloud:8741';
    beforeAll(async () => {
        kafka = new kafkajs_1.Kafka({
            clientId: 'test-client',
            brokers: [brokerUrl],
        });
        const defaultConfigConsumer = {
            groupId: 'st-packages',
            allowAutoTopicCreation: true,
            retry: {
                retries: 0,
            },
        };
        kafkaConsumer = new kafkaConsumer_1.KafkaConsumer(kafka, defaultConfigConsumer);
        mockConsumer = {
            connect: jest.fn(),
            subscribe: jest.fn(),
            run: jest.fn(),
            on: jest.fn(),
            events: {
                CONNECT: 'consumer.connect',
                DISCONNECT: 'consumer.disconnect',
                REQUEST_TIMEOUT: 'consumer.request_timeout',
            },
        };
        kafka.consumer.mockReturnValue(mockConsumer);
    });
    afterAll(async () => {
        jest.clearAllMocks();
    });
    it('should create a instance of KafkaConsumer', async () => {
        const mockKafkaParams = {
            serviceName: 'st-packages',
            username: 'test',
            password: 'test123',
            brokers: [brokerUrl],
            logLevel: 0,
            retry: {
                restartOnFailure: async () => false,
            },
        };
        const getKafkaInstanceSpy = jest.spyOn(kafka_1.KafkaConnectionConsumerSingleton, 'getKafkaInstance');
        const kafkaConsumer = kafka_1.KafkaConsumerFactory.create(mockKafkaParams);
        expect(getKafkaInstanceSpy).toBeCalled();
        expect(kafkaConsumer instanceof kafkaConsumer_1.KafkaConsumer).toBeTruthy();
    });
    it('should consume new messages from unique topic', async () => {
        const itemName = crypto_1.default.randomBytes(4).toString('hex');
        const handler = jest.fn();
        const TOPICS_HANDLERS_MOCK = [
            {
                topic: 'create-item',
                handler: handler,
            },
        ];
        const payload = { name: itemName };
        const consumeKafkaConsumerSpy = jest.spyOn(kafkaConsumer, 'consume');
        const startKafkaConsumerSpy = jest.spyOn(kafkaConsumer, 'start');
        mockConsumer.run.mockImplementation(({ eachMessage }) => {
            eachMessage({
                message: {
                    key: Buffer.from('key'),
                    value: Buffer.from(JSON.stringify(payload)),
                    headers: { cid: Buffer.from('test-cid') },
                },
                partition: 0,
                topic: TOPICS_HANDLERS_MOCK[0].topic,
                heartbeat: jest.fn(),
            });
        });
        await kafkaConsumer.consume({
            topicsHandlers: TOPICS_HANDLERS_MOCK,
            fromBeginning: true,
        });
        expect(startKafkaConsumerSpy).toBeCalled();
        expect(consumeKafkaConsumerSpy).toBeCalledWith({
            topicsHandlers: TOPICS_HANDLERS_MOCK,
            fromBeginning: true,
        });
        expect(handler).toBeCalledWith(expect.objectContaining({
            message: expect.objectContaining(payload),
        }));
    });
    it('should consume new messages from multiple topics', async () => {
        const itemName = crypto_1.default.randomBytes(4).toString('hex');
        const handler1 = jest.fn();
        const handler2 = jest.fn();
        const TOPICS_HANDLERS_MOCK = [
            {
                topic: 'create-item',
                handler: handler1,
            },
            {
                topic: 'item-created',
                handler: handler2,
            },
        ];
        const payload = { name: itemName };
        const consumeKafkaConsumerSpy = jest.spyOn(kafkaConsumer, 'consume');
        const startKafkaConsumerSpy = jest.spyOn(kafkaConsumer, 'start');
        mockConsumer.run.mockImplementation(({ eachMessage }) => {
            eachMessage({
                message: {
                    key: Buffer.from('key'),
                    value: Buffer.from(JSON.stringify(payload)),
                    headers: { cid: Buffer.from('test-cid') },
                },
                partition: 0,
                topic: TOPICS_HANDLERS_MOCK[0].topic,
                heartbeat: jest.fn(),
            });
        });
        await kafkaConsumer.consume({
            topicsHandlers: TOPICS_HANDLERS_MOCK,
            fromBeginning: true,
        });
        expect(startKafkaConsumerSpy).toBeCalled();
        expect(consumeKafkaConsumerSpy).toBeCalledWith({
            topicsHandlers: TOPICS_HANDLERS_MOCK,
            fromBeginning: true,
        });
        expect(handler1).toBeCalledWith(expect.objectContaining({
            message: expect.objectContaining(payload),
        }));
        expect(handler2).not.toBeCalled();
        expect(kafka.consumer).toBeCalled();
    });
});
//# sourceMappingURL=KafkaConsumerFactory.unit.test.js.map