import { ConsumerConfig } from 'kafkajs';
import { ICreateKafkaParams } from '../../messaging.interface';
import { KafkaConsumer } from './kafkaConsumer';
export declare class KafkaConsumerFactory {
    static create(kafkaparams: ICreateKafkaParams, consumerConfig?: ConsumerConfig): KafkaConsumer;
}
