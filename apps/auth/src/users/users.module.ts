import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, Role } from '@app/common';
import { User } from '@app/common';
import { UsersRepository } from './users.repository';
import { KafkaConfig } from '@app/common/kafka';
import { KafkaModule } from '@app/common/kafka';

const kafkaConfig: KafkaConfig = {
  clientId: 'users',
  brokers: ['kafka:9092'],
};

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([User, Role]),
    KafkaModule.register(kafkaConfig),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
