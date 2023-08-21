import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { KafkaConfig } from './kafka.config';
import { Observable, from, retry } from 'rxjs';

@Injectable()
export class KafkaService implements OnModuleDestroy, OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;

  constructor(@Inject('KAFKA_CONFIG') private kafkaConfig: KafkaConfig) {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
    });

    this.producer = this.kafka.producer({
      retry: {
        retries: 5,
      },
    });
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  // when the module is destroyed we want to gracefully disconnect from Kafka
  async onModuleDestroy() {
    // await this.producer.disconnect();
  }

  async emit(topic: string, message: any): Promise<void> {
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  // async send(topic: string, message: any): Promise<Observable<any>> {
  //   // method that send a kafka message and returns an observable that will emit the response
  //   const { value } = await this.producer.send({
  //     topic,
  //     messages: [{ value: JSON.stringify(message) }],
  //   });
  // }
}
