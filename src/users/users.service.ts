import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { FilterDto } from './dto/filter.dto';
import { FilterService } from 'src/posts/filter.service';

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
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const result = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return result;
  }

  async remove(id: number) {
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
