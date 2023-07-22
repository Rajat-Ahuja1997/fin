import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // an event pattern is event-based, we don't send a response back. We simply receive an event from somewhere and then do something.
  @UsePipes(new ValidationPipe())
  @EventPattern('notify_email')
  async notifyEmail(@Payload() notifyEmailDto: NotifyEmailDto) {
    await this.notificationsService.notifyEmail(notifyEmailDto);
  }
}
