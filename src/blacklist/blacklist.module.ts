import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blacklist } from 'breaklee-data-lib/dist/entity/blacklist.entity';
import { BlacklistService } from './blacklist.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blacklist])],
  providers: [BlacklistService],
  controllers: [],
  exports: [BlacklistService],
})
export class BlacklistModule {}
