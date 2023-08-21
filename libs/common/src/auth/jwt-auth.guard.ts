import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { User } from '../entities';
import { Reflector } from '@nestjs/core';

// this AuthGuard will be in front of any of our public facing API routes. It expects to be passed Jwt cookie
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {} // allows us to communicate to our other microservices, here it is the AuthService
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
    if (!jwt) {
      return false;
    }

    console.log('inside auth guard');
    // const roles = this.reflector.get<string[]>('roles', context.getHandler());
    return this.authClient
      .send<User>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        // pipe additional operators to the observable
        tap((res) => {
          // if (roles) {
          //   for (const role of roles) {
          //     if (!res.roles?.map((role) => role.name).includes(role)) {
          //       this.logger.error('The user does not have valid roles');
          //       throw new UnauthorizedException();
          //     }
          //   }
          // }
          context.switchToHttp().getRequest().user = res; // the res we get back from the auth service is the user itself.
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      );
  }
}
