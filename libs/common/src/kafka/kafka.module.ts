import { DynamicModule, Module } from '@nestjs/common';
import { KafkaConfig } from './kafka.config';
import { KafkaService } from './kafka.service';

@Module({})
export class KafkaModule {
  static register(kafkaConfig: KafkaConfig): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: 'KAFKA_CONFIG',
          useValue: kafkaConfig,
        },
        KafkaService,
      ],
      exports: [KafkaService],
    };
  }
}
