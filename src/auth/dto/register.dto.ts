import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RegisterRequestDto {
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  @ApiProperty()
  username: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(16)
  @ApiProperty()
  password: string;
}

export class RegisterResponseDto {
  @ApiProperty()
  @Expose()
  token: string;
}
