import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../../../../libs/common/src/decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '@app/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard) // Leverages the JWT strategy to populate metadata to the request object
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  // define an event for the users service that will be trigger when users are outbid
  @EventPattern('users_outbid')
  async handleUsersOutbid(data: any) {
    console.log('inside users service');
    await this.usersService.handleUsersOutbid(data);
  }
}
