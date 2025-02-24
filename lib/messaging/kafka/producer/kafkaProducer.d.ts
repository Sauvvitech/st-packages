import { ProducerConfig } from 'kafkajs';
import { ICreateKafkaParams, IParamsProduce, IParamsProduceMultipleMessages, IProducer } from '../../messaging.interface';
export declare class KafkaProducer implements IProducer {
    private readonly producerConfig;
    private static instance;
    private readonly producer?;
    constructor({ logLevel: levelLogging, serviceName, brokers, password, username, }: ICreateKafkaParams, producerConfig: ProducerConfig);
    static getInstance(params: ICreateKafkaParams, config: ProducerConfig): KafkaProducer;
    produce({ topic, message, key, headers, }: IParamsProduce): Promise<void>;
    produceMultipleMessages({ topic, messages, key, headers, }: IParamsProduceMultipleMessages): Promise<void>;
    private registerListener;
    private send;
    convertMessagesValuesToString(messages: Array<{
        key: string;
        value: any;
    }>): Array<{
        key: string;
        value: string;
    }>;
    shutdown(): Promise<void>;
}
