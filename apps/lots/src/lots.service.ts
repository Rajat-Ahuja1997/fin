import { User } from '@app/common';
import { Injectable } from '@nestjs/common';
import { CreateLotDto } from './dto/create-lot.dto';
import { Lot, LotStatus } from './entities/lot.entity';
import { LotsRepository } from './lots.repository';

@Injectable()
export class LotsService {
  async addBidForLot() {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly lotsRepository: LotsRepository) {}

  async createLot(user: User, createLotDto: CreateLotDto) {
    const { id: sellerId } = user;

    const lot = new Lot({
      ...createLotDto,
      status: LotStatus.Upcoming,
      sellerId,
    });
    await this.lotsRepository.create(lot);
  }
}
