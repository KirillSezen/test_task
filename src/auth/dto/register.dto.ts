import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'user email',
    example: 'zibbid33@mail.ru',
  })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Is required' })
  @IsEmail({}, { message: 'Must be a email' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'QwErt2331',
  })
  @IsString({ message: 'Must be a string' })
  @IsStrongPassword({}, { message: 'Must be a strong password' })
  @IsNotEmpty({ message: 'Is required' })
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
    default: 'USER',
  })
  role?: Role;
}

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
