import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FilterDto } from '../users/dto/filter.dto';
import { FilterService } from './filter.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private filterService: FilterService,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const result = await this.prisma.post.create({
      data: { ...createPostDto, userId },
    });
    return result;
  }

  async findAll(filterDto: FilterDto) {
    const posts = await this.filterService.filterPosts(filterDto);
    return posts;
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new HttpException(
        'Post with such id doent exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new HttpException(
        'Post with such id doent exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
    return result;
  }

  async remove(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new HttpException(
        'Post with such id doent exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.prisma.post.delete({ where: { id } });
    return result;
  }
}
