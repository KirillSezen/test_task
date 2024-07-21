import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
    minLength: 5,
    maxLength: 30,
  })
  @IsString({ message: 'Must be a string' })
  @MinLength(5)
  @MaxLength(30)
  @IsNotEmpty({ message: 'Is Required' })
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is the content of my first post.',
    minLength: 5,
    maxLength: 300,
  })
  @MinLength(5)
  @MaxLength(300)
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Is Required' })
  content: string;

  @ApiProperty({
    description: 'The ID of the user who created the post',
    example: 1,
  })
  @IsNumber({}, { message: 'Must be a number' })
  @IsNotEmpty({ message: 'Is Required' })
  userId: number;
}
