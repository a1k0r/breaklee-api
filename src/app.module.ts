import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';
// import { Account } from './account/account.entity';
import { BlacklistModule } from './blacklist/blacklist.module';
import { Account } from 'breaklee-data-lib';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
});

const logModule = WinstonModule.forRoot({
  transports: [new transports.Console()],
});

const authDbModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('DB_AUTH_HOST'),
    port: configService.get('DB_AUTH_PORT'),
    username: configService.get('DB_AUTH_USERNAME'),
    password: configService.get('DB_AUTH_PASSWORD'),
    database: configService.get('DB_AUTH_DATABASE'),
    entities: [Account],
  }),
  inject: [ConfigService],
});

@Module({
  imports: [
    configModule,
    logModule,
    authDbModule,
    AuthModule,
    AccountModule,
    BlacklistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
