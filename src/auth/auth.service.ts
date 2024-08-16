import { Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';
import { Account } from '../account/account.entity';
import { JwtService } from '@nestjs/jwt';

export type AuthTokenPayload = {
  accountId: number;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  hashPassword(
    password: string,
    salt?: Buffer,
  ): { hash: Buffer; salt: Buffer } {
    // WARN: hashPassword implementation must be exactly the same as the one in the game server
    const PASSWORD_SALT_LENGTH = 64;
    const PASSWORD_HASH_ALGORITHM = 'sha512';

    const bufferLength = PASSWORD_SALT_LENGTH + password.length + 1;

    const buffer = Buffer.alloc(bufferLength);

    const _salt = salt ?? randomBytes(PASSWORD_SALT_LENGTH);

    _salt.copy(buffer, 0, 0, PASSWORD_SALT_LENGTH);
    buffer.write(password, PASSWORD_SALT_LENGTH);

    const hash = createHash(PASSWORD_HASH_ALGORITHM);
    hash.update(buffer);

    const hashedPassword = hash.digest();

    return {
      hash: hashedPassword,
      salt: _salt,
    };
  }

  verifyPassword(password: string, salt: Buffer, hash: Buffer): boolean {
    const { hash: passwordHash } = this.hashPassword(password, salt);

    return hash.equals(passwordHash);
  }

  async issueToken(account: Account) {
    const payload: AuthTokenPayload = {
      accountId: account.id,
    };

    return this.jwtService.signAsync(payload);
  }
}
