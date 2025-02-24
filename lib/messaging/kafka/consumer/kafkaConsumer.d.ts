import { ConsumerConfig, Kafka } from 'kafkajs';
import { IConsumer, IParamsConsumeKafka } from './../../messaging.interface';
export declare class KafkaConsumer implements IConsumer {
    private readonly kafkaInstance;
    private readonly consumerConfig;
    private consumer?;
    constructor(kafkaInstance: Kafka, consumerConfig: ConsumerConfig);
    consume({ topicsHandlers, fromBeginning, }: IParamsConsumeKafka): Promise<void>;
    start(): Promise<void>;
    parseBufferToObject(message: Buffer): any;
    shutdown(): Promise<void>;
    private registerListener;
}
