import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { UserDocument } from './users/entities/user.schema';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MessagePattern } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard) // verify we are a valid user
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument, // pull the current user off the request
    @Res({ passthrough: true }) response: Response, // set the JWt as a cookie on the response object
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @UseGuards(JwtAuthGuard) // verify we are a valid user
  @MessagePattern('authenticate')
  async authenticate() {}
}
