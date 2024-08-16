import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MeResponseDto } from './dto/me.dto';
import { plainToInstance } from 'class-transformer';
import { AuthTokenPayload } from '../auth/auth.service';
import { AccountService } from './account.service';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'User successfully fetched',
    type: MeResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async me(@Req() request: Request): Promise<MeResponseDto> {
    const authTokenPayload: AuthTokenPayload = request['auth'];

    const account = await this.accountService.findById(
      authTokenPayload.accountId,
    );

    // TODO: Add session check for online_in_game

    const result = {
      ...account,
    };

    return plainToInstance(MeResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
