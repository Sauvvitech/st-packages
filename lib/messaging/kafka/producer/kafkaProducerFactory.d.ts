import { ProducerConfig } from 'kafkajs';
import { ICreateKafkaParams } from '../../messaging.interface';
import { KafkaProducer } from './kafkaProducer';
export declare class KafkaProducerFactory {
    static create(kafkaparams: ICreateKafkaParams, producerConfig?: ProducerConfig): KafkaProducer;
}
