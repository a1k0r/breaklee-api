import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Blacklist } from 'breaklee-data-lib/dist/entity/blacklist.entity';
import { InjectRepository } from '@nestjs/typeorm';

export type CheckBlacklistData = {
  account_id: number;
  address_ip?: string;
};

@Injectable()
export class BlacklistService {
  constructor(
    @InjectRepository(Blacklist)
    private readonly blacklistRepository: Repository<Blacklist>,
  ) {}

  async isBlacklisted(data: CheckBlacklistData): Promise<boolean> {
    const blacklist = await this.blacklistRepository.findOne({
      where: [{ account_id: data.account_id }, { address_ip: data.address_ip }],
    });

    return Boolean(blacklist);
  }
}
