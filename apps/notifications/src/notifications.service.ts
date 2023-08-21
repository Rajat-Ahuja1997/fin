import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { NewBidEvent } from '@app/common/events/new-bid-event';
import { KafkaService } from '@app/common/kafka';
import { UserOutbidEnrichedEvent, UserOutbidEvent } from '@app/common';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService,
  ) {}
  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get('SMTP_USER'),
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  }); // we provide the options object to configure an SMTP server
  async notifyEmail({ email, text }: NotifyEmailDto) {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: 'fin Notification',
      text,
    });
    console.log(email);
  }

  async handleNewBid(data: NewBidEvent) {
    console.log('handling new bid');
    this.kafkaService.emit(
      'users_outbid',
      new UserOutbidEvent(data.previousBidders),
    );
  }

  async notifyNewBid(data: UserOutbidEnrichedEvent) {
    console.log(data);
    const emails = data.users.map((user) => user.email);
    console.log(emails);
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: emails[0],
      subject: 'fin Notification',
      text: 'This is my text',
    });
  }
}
