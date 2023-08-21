import { Module } from '@nestjs/common';
import { DatabaseModule, LoggerModule } from '@app/common';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';
import { Lot } from './entities/lot.entity';
import { LotsRepository } from './lots.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([Lot]),
  ],
  controllers: [LotsController],
  providers: [LotsService, LotsRepository],
})
export class LotsModule {}
