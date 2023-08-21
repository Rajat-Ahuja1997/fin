import { Injectable } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { Bid } from './entities/bid.entity';
import { BidsRepository } from '../bids.repository';
import { KafkaService } from '@app/common/kafka';
import { NewBidEvent } from '@app/common/events';
import { User } from '@app/common';

@Injectable()
export class BidsService {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly bidsRepository: BidsRepository,
  ) {}

  async createBid(user: User, createBidDto: CreateBidDto) {
    const { id: bidder } = user;

    const { lotId, amount } = createBidDto;
    const previousBids: Bid[] = await this.bidsRepository.find({
      lotId,
    });

    if (previousBids.length !== 0) {
      const highestBid = previousBids.reduce((prev, current) =>
        prev.amount > current.amount ? prev : current,
      );

      if (highestBid.amount >= createBidDto.amount) {
        throw new Error('Bid amount is too low');
      }
    }

    const previousBidders = previousBids.map((bid) => bid.bidder);

    const bid = new Bid({
      ...createBidDto,
      bidder,
      created: new Date(),
    });

    this.kafkaService.emit(
      'new_bid',
      new NewBidEvent(lotId, amount, bidder, new Date(), previousBidders),
    );

    return await this.bidsRepository.create(bid);
  }
}
