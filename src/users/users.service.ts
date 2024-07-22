import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { FilterDto } from './dto/filter.dto';
import { FilterService } from '../posts/filter.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private filterService: FilterService,
  ) {}

  async findAll(filterDto: FilterDto) {
    const users = await this.filterService.filterUsers(filterDto);
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(
        'User with such id doent exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(
        'User with such id doent exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return result;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(
        'User with such id doent exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.prisma.user.delete({ where: { id } });
    return result;
  }

  async createUser(registerDto: RegisterDto) {
    const user = await this.prisma.user.create({ data: registerDto });
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { posts: true },
    });
    return user;
  }
}
