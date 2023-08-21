import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { NewBidEvent } from '@app/common/events';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // an event pattern is event-based, we don't send a response back. We simply receive an event from somewhere and then do something.
  @UsePipes(new ValidationPipe())
  @EventPattern('notify_email')
  async notifyEmail(@Payload() notifyEmailDto: NotifyEmailDto) {
    await this.notificationsService.notifyEmail(notifyEmailDto);
  }

  @EventPattern('new_bid')
  @UsePipes(new ValidationPipe())
  async handleNewBid(data: any) {
    await this.notificationsService.handleNewBid(data);
  }

  @EventPattern('notify_outbid')
  @UsePipes(new ValidationPipe())
  async notifyNewBid(data: any) {
    await this.notificationsService.notifyNewBid(data);
  }
}
