import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../account/account.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';

const jwtModule = JwtModule.registerAsync({
  global: true,
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    global: true,
    secret: configService.get<string>('API_AUTH_TOKEN_TTL'),
    signOptions: { expiresIn: configService.get<string>('API_AUTH_TOKEN_TTL') },
  }),
  inject: [ConfigService],
});

@Module({
  imports: [jwtModule, AccountModule],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
