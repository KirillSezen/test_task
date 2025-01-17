import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, PostsModule],
  exports: [UsersService],
})
export class UsersModule {}
