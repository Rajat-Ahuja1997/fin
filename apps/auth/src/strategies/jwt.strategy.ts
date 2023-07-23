import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (
          request: any, // request can be from express or RPC call hence any
        ) => request?.cookies?.Authentication || request?.Authentication,
      ]), // specifies where on the request object the JWT lives. In our case it is a cookie
      secretOrKey: configService.get('JWT_SECRET'), // this is the key we use to sign + verify the cookie
    });
  }

  async validate({ userId }: TokenPayload) {
    return await this.userService.getUser({ id: userId });
  }
}
