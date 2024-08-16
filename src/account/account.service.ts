import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';

export type CreateAccountData = {
  username: string;
  email: string;
  hash: Buffer;
  salt: Buffer;
};

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(data: CreateAccountData): Promise<Account> {
    const account = new Account();
    account.username = data.username;
    account.email = data.email;
    account.email_verified = false;
    account.salt = data.salt;
    account.hash = data.hash;

    return this.accountRepository.save(account);
  }

  async checkAvailability(
    data: Pick<CreateAccountData, 'username' | 'email'>,
  ): Promise<boolean> {
    const existingAccount = await this.accountRepository.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });

    return !existingAccount;
  }

  async findById(id: number): Promise<Account> {
    return this.accountRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<Account> {
    return this.accountRepository.findOne({ where: { username } });
  }
}
