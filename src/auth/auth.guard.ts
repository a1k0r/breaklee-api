import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_REQUEST_KEY, AUTH_TOKEN_HEADER } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenPayload } from './auth.service';
import { BlacklistService } from '../blacklist/blacklist.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(BlacklistService)
    private readonly blacklistService: BlacklistService,
  ) {}

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

      const blacklisted = await this.blacklistService.isBlacklisted({
        account_id: payload.accountId,
        address_ip: request.ip,
      });

      if (blacklisted) {
        throw new UnauthorizedException();
      }

      request[AUTH_REQUEST_KEY] = payload;
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
