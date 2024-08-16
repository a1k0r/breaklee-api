import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LoginRequestDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  @Expose()
  token: string;
}
