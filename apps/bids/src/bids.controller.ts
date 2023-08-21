import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard, User } from '@app/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { EventPattern } from '@nestjs/microservices';
import { KafkaService } from '@app/common/kafka';

@Controller('bids')
export class BidsController {
  constructor(
    private readonly bidsService: BidsService,
    private readonly kafkaService: KafkaService,
  ) {}

  @EventPattern('my_topic')
  async handleMyTopic() {
    console.log('received new message');
    this.kafkaService.emit('lots_topic', 'new message');
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBid(
    @Body() createBidDto: CreateBidDto,
    @CurrentUser() user: User,
  ) {
    return await this.bidsService.createBid(user, createBidDto);
  }
}
