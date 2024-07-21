import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FilterService } from './filter.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, FilterService],
  imports: [PrismaModule],
  exports: [FilterService],
})
export class PostsModule {}
