import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { BidsModule } from './bids.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(BidsModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:9092'],
      },
      consumer: {
        // group ID is the same as the group ID in the client
        groupId: 'bids-consumer',
      },
    },
  });

  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
