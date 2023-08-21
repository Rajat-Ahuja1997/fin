import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { LoggerModule } from '@app/common';
import { KafkaModule } from '@app/common/kafka';
import { KafkaConfig } from '@app/common/kafka';

const kafkaConfig: KafkaConfig = {
  clientId: 'payments',
  brokers: ['kafka:9092'],
};
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        STRIPE_SECRET_KEY: Joi.string().required(),
      }),
    }),
    LoggerModule,
    KafkaModule.register(kafkaConfig),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
