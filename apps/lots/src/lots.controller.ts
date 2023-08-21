import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LotsService } from './lots.service';
import { CurrentUser, User } from '@app/common';
import { CreateLotDto } from './dto/create-lot.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @EventPattern('lots_topic')
  handleLotsTopic(payload: any) {
    console.log('received new lots message');
  }

  @Post()
  async create(@Body() createLotDto: CreateLotDto, @CurrentUser() user: User) {
    return await this.lotsService.createLot(user, createLotDto);
  }

  // @EventPattern('new_bid')
  // @UsePipes(new ValidationPipe())
  // addBidForLot(data: any) {
  //   console.log('received the new bid inside lots');
  //   console.log(data);
  //   // return await this.lotsService.addBidForLot();
  // }
}
