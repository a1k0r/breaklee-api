import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Inject,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountService } from '../account/account.service';
import { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import { ApiResponse } from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('register')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully registered',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Incorrect data passed' })
  async register(
    @Body() body: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const credentialsAvailable = await this.accountService.checkAvailability({
      username: body.username,
      email: body.email,
    });

    if (!credentialsAvailable) {
      throw new HttpException('Account already exists', 400);
    }

    const { hash, salt } = this.authService.hashPassword(body.password);

    const account = await this.accountService.create({
      username: body.username,
      email: body.email,
      hash,
      salt,
    });

    const result = {
      token: await this.authService.issueToken(account),
    };

    return plainToInstance(RegisterResponseDto, result);
  }

  @Post('login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Incorrect credentials' })
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    const account = await this.accountService.findByUsername(body.username);

    if (!account) {
      throw new HttpException('Incorrect credentials', 400);
    }

    const passwordCorrect = this.authService.verifyPassword(
      body.password,
      account.salt,
      account.hash,
    );

    this.logger.log('info', passwordCorrect);

    if (!passwordCorrect) {
      throw new HttpException('Incorrect credentials', 400);
    }

    const result = {
      token: await this.authService.issueToken(account),
    };

    return plainToInstance(LoginResponseDto, result);
  }
}
