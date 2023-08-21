import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { LotsModule } from './lots.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(LotsModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:9092'],
      },
      consumer: {
        // group ID is the same as the group ID in the client
        groupId: 'lots-consumer',
      },
    },
  });

  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap();
