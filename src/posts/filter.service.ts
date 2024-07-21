import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterDto } from 'src/users/dto/filter.dto';

@Injectable()
export class FilterService {
  constructor(private prisma: PrismaService) {}

  async filterPosts(filterDto: FilterDto) {
    const { page, limit, search, description, sort, order } = filterDto;
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (search) {
      whereConditions['OR'] = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (description) {
      whereConditions['content'] = {
        not: null || '',
      };
    }

    const orderByConditions = {};
    if (sort && order) {
      orderByConditions[sort] = order;
    }

    const posts = await this.prisma.post.findMany({
      where: whereConditions,
      orderBy: orderByConditions,
      skip: offset,
      take: limit,
    });

    return posts;
  }

  async filterUsers(filterDto: FilterDto) {
    const { page, limit, search, sort, order } = filterDto;
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (search) {
      whereConditions['OR'] = [
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderByConditions = {};
    if (sort && order) {
      orderByConditions[sort] = order;
    }

    const users = await this.prisma.user.findMany({
      where: whereConditions,
      orderBy: orderByConditions,
      skip: offset,
      take: limit,
    });

    return users;
  }
}
