import { Consumer, ConsumerConfig, Kafka } from 'kafkajs';
import { ContextAsyncHooks, Logger } from 'traceability';
const { randomUUID } = require('crypto');
import { IConsumer, IParamsConsumeKafka } from './../../messaging.interface';
import { ProcessEventsGracefulShutdownEnum } from '../../../graceful-shutdown';

export class KafkaConsumer implements IConsumer {
  private consumer?: Consumer;

  constructor(
    private readonly kafkaInstance: Kafka,
    private readonly consumerConfig: ConsumerConfig,
  ) {}

  async consume({
    topicsHandlers,
    fromBeginning,
  }: IParamsConsumeKafka): Promise<void> {
    await this.start();

    const topics = topicsHandlers.map((th) => th.topic);
    this.consumer?.subscribe({ topics, fromBeginning });

    await this.consumer?.run({
      eachMessage: async ({
        message: messageBuffer,
        heartbeat,
        partition,
        topic,
      }) => {
        const key = messageBuffer.key!.toString();
        const value = this.parseBufferToObject(messageBuffer.value!);
        const headers = messageBuffer.headers;

        try {
          const cid = headers?.cid?.toString() || randomUUID();
          ContextAsyncHooks.setContext({ cid });

          const topicHandler = topicsHandlers.find((th) => th.topic === topic);

          await topicHandler?.handler({
            message: value,
            key,
            heartbeat,
            topic,
            partition,
            headers,
          });
        } catch (error: any) {
          Logger.error(error);

          //TODO: Implement retry logic
        }
      },
    });

    this.consumer?.on('consumer.crash', () => {
      process.kill(process.pid, ProcessEventsGracefulShutdownEnum.SIGTERM);
    });
  }

  async start(): Promise<void> {
    this.consumer = this.kafkaInstance.consumer(this.consumerConfig);
    this.registerListener();
    await this.consumer?.connect();
  }

  parseBufferToObject(message: Buffer) {
    return JSON.parse(message.toString());
  }

  async shutdown(): Promise<void> {
    await this.consumer?.disconnect();
  }

  private registerListener() {
    this.consumer?.on(this.consumer.events.CONNECT, () => {
      Logger.info('Consumer Connected', {
        eventName: `KafkaConsumer.registerListener.CONNECT`,
      });
    });
    this.consumer?.on(this.consumer.events.DISCONNECT, () => {
      Logger.warn('Consumer Disconnected', {
        eventName: `KafkaConsumer.registerListener.DISCONNECT`,
      });
    });

    this.consumer?.on(this.consumer.events.REQUEST_TIMEOUT, (data) => {
      Logger.warn('Consumer Timeout', {
        eventName: `KafkaConsumer.registerListener.REQUEST_TIMEOUT`,
        eventData: data,
      });
    });
  }
}
