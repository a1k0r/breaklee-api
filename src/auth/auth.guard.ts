import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_TOKEN_HEADER } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenPayload } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(context);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<AuthTokenPayload>(token);

      // TODO: Add user selection

      // TODO: Add blacklist check

      request['auth'] = payload;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractToken(context: ExecutionContext): string {
    const req = context.switchToHttp().getRequest();

    return req.header(AUTH_TOKEN_HEADER);
  }
}
