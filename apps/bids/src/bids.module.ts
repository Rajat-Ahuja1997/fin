import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { BidsRepository } from '../bids.repository';
import { Bid } from './entities/bid.entity';
import { KafkaModule } from '@app/common/kafka';
import { KafkaConfig } from '@app/common/kafka';
import { ClientsModule, Transport } from '@nestjs/microservices';

const kafkaConfig: KafkaConfig = {
  clientId: 'bids',
  brokers: ['kafka:9092'],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([Bid]),
    KafkaModule.register(kafkaConfig),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'bids',
              brokers: ['kafka:9092'],
            },
          },
        }),
      },
    ]),
  ],
  controllers: [BidsController],
  providers: [BidsService, BidsRepository],
})
export class BidsModule {}
