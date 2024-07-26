import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { FilterService } from '../../src/posts/filter.service';
import { UpdateUserDto } from '../../src/users/dto/update-user.dto';
import { RegisterDto } from '../../src/auth/dto/register.dto';
import { FilterDto } from '../../src/users/dto/filter.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let filterService: FilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: FilterService,
          useValue: {
            filterUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    filterService = module.get<FilterService>(FilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const filterDto: FilterDto = {
        search: 'John',
      };
      const expectedResult = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'John Smith', email: 'smith@example.com' },
      ];

      (filterService.filterUsers as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.findAll(filterDto);

      expect(filterService.filterUsers).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const expectedResult = {
        id: 1,
        email: 'john@example.com',
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.findOne(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if user is not found', async () => {
      const userId = 1;

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(
        new HttpException(
          'User with such id doesnt exist',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        email: 'john@example.com',
      };
      const expectedResult = {
        id: 1,
        email: 'john@example.com',
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
        expectedResult,
      );
      (prismaService.user.update as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.update(userId, updateUserDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateUserDto,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if user is not found', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        email: 'john@example.com',
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        new HttpException(
          'User with such id doesnt exist',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 1;
      const expectedResult = {
        id: 1,
        email: 'john@example.com',
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
        expectedResult,
      );
      (prismaService.user.delete as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.remove(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if user is not found', async () => {
      const userId = 1;

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow(
        new HttpException(
          'User with such id doesnt exist',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const registerDto: RegisterDto = {
        email: 'john@example.com',
        password: 'password',
      };
      const expectedResult = {
        id: 1,
        email: 'john@example.com',
      };

      (prismaService.user.create as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.createUser(registerDto);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: registerDto,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'john@example.com';
      const expectedResult = {
        id: 1,
        email: 'john@example.com',
        posts: [],
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.getUserByEmail(email);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        include: { posts: true },
      });
      expect(result).toEqual(expectedResult);
    });
  });
});
