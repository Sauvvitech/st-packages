import { Kafka } from 'kafkajs';
import { ICreateKafkaParams } from '../../messaging.interface';
export declare class KafkaConnectionConsumerSingleton extends Kafka {
    private static kafkaInstance;
    private constructor();
    static getKafkaInstance(kafkaParams: ICreateKafkaParams): KafkaConnectionConsumerSingleton;
}
