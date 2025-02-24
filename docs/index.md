# ST - Packages

A package from manager packages for sauvvitech services.

## Installation

## Funcionalidades

- Graceful Shutdown
- Kafka

## Usage/Examples

### Graceful Shutdown

To use graceful server shutdown to properly terminate connections, you need to import `GracefulShutdownManager`. like it

```javascript
import { GracefulShutdownManager } from '';

/**
 * The server variable value is app.listen method return
 */
const shutdownManager = new GracefulShutdownManager(server);
shutdownManager.handleTerminateServer(async () => {
  /**
   * Close connections in SIGTERM and SIGINT events here
   *
   * Example:
   * await app.closeDatabase();
   */
});
shutdownManager.handleTerminate(async () => {
  /**
   * Close connections in server.close() event here
   *
   * Example:
   * await orderWorker.stop();
   */
});
```

### Kafka

Apache Kafka is a distributed event store and stream-processing platform. It is an open-source system developed by the Apache Software Foundation written in Java and Scala. The project aims to provide a unified, high-throughput, low-latency platform for handling real-time data feeds.

```javascript
import {
  KafkaConsumerFactory,
  IConsumer,
  KafkaProducerFactory,
  IProducer,
} from '';

// consumer
const kafkaConsumer = KafkaConsumerFactory.create({
  serviceName: SERVICE_NAME,
  username: KAFKA_USERNAME,
  password: KAFKA_PASSWORD,
  brokers: KAFKA_BROKERS,
  logLevel: KAFKA_LOGLEVEL,
});
const isFromBeginning = true;

const topicsHandlers = [
  {
    topic: TOPIC.NAME_1,
    handler: callbackFunction1,
  },
  {
    topic: TOPIC.NAME_2,
    handler: callbackFunction2,
  },
];

kafkaConsumer.consume({
  topicsHandlers,
  fromBeginning: isFromBeginning,
});

// producer
const kafkaProducer = KafkaProducerFactory.create({
  serviceName: SERVICE_NAME,
  username: KAFKA_USERNAME,
  password: KAFKA_PASSWORD,
  brokers: KAFKA_BROKERS,
  logLevel: KAFKA_LOGLEVEL,
});

const message = {
  key: params._id,
  value: params,
};
kafkaProducer.produce(topicName, message);

const messages = [
  {
    key: params._id,
    value: params,
  },
  {
    key: params._id,
    value: params,
  },
];
kafkaProducer.produceMultipleMessages(topicName, messages);
```

#### Producer

The **producer** in Apache Kafka is responsible for sending data to specific topics. It publishes messages to a topic, which are then stored and distributed to interested consumers.

**Configuration and Usage:**

1. **Creating the Producer:**
   The producer is created using `KafkaProducerFactory.create()`, where you configure necessary parameters such as service name, authentication credentials, Kafka brokers, and log level.

   ```javascript
   const kafkaProducer = KafkaProducerFactory.create({
     serviceName: SERVICE_NAME,
     username: KAFKA_USERNAME,
     password: KAFKA_PASSWORD,
     brokers: KAFKA_BROKERS,
     logLevel: KAFKA_LOGLEVEL,
   });
   ```

2. **Sending Messages:**
   Once configured, you can use the producer to send messages to a topic. Messages are composed of a key (`key`) and a value (`value`).

   - **Send a single message:**

     ```javascript
     const message = {
       key: params._id,
       value: params,
     };
     kafkaProducer.produce(topicName, message);
     ```

   - **Send multiple messages:**

     ```javascript
     const messages = [
       {
         key: params._id,
         value: params,
       },
       {
         key: params._id,
         value: params,
       },
     ];
     kafkaProducer.produceMultipleMessages(topicName, messages);
     ```

   The key is used to partition messages and can help in maintaining the order of messages within a specific partition.

#### Consumer

The **consumer** in Apache Kafka reads data from one or more topics. It consumes messages published by producers, processes these messages, and can perform tasks such as transformation or analysis.

**Configuration and Usage:**

1. **Creating the Consumer:**
   The consumer is configured using `KafkaConsumerFactory.create()`, with similar parameters as the producer, including service name, credentials, and brokers.

   ```javascript
   const kafkaConsumer = KafkaConsumerFactory.create({
     serviceName: SERVICE_NAME,
     username: KAFKA_USERNAME,
     password: KAFKA_PASSWORD,
     brokers: KAFKA_BROKERS,
     logLevel: KAFKA_LOGLEVEL,
   });
   ```

2. **Consuming Messages:**
   The consumer can be set up to consume messages from multiple topics, and you define handlers (callback functions) to process the messages from each topic.

   - **Configuring topics and handlers:**

     ```javascript
     const topicsHandlers = [
       {
         topic: TOPIC.NAME_1,
         handler: callbackFunction1,
       },
       {
         topic: TOPIC.NAME_2,
         handler: callbackFunction2,
       },
     ];
     ```

   - **Starting consumption:**

     ```javascript
     kafkaConsumer.consume({
       topicsHandlers,
       fromBeginning: isFromBeginning,
     });
     ```

   The `fromBeginning` parameter indicates whether the consumer should start reading messages from the beginning of the topic or only the new messages arriving after the start of consumption.

## Authors

- [@lucasSlv](https://www.github.com/lucasSlv)

## Contributors

-
