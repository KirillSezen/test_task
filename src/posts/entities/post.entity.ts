import { Post } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PostEntity implements Post {
  @ApiProperty({
    description: 'The unique identifier of the post',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
  })
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is the content of my first post.',
  })
  content: string;

  @ApiProperty({
    description: 'The ID of the user who created the post',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'The date and time when the post was created',
    example: '2024-07-21T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the post was last updated',
    example: '2024-07-21T15:30:00Z',
  })
  updatedAt: Date;
}
