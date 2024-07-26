import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';
import { UpdateUserDto } from '../../src/users/dto/update-user.dto';
import { FilterDto } from '../../src/users/dto/filter.dto';
import { UserEntity } from '../../src/users/entities/user.entity';
import { JwtAuthGuard } from '../../src/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/guards/roles.guard';
import { UserOrAdminGuard } from '../../src/guards/user-or-admin.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(UserOrAdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const filterDto: FilterDto = {
        search: 'John',
      };
      const expectedResult: UserEntity[] = [
        {
          id: 1,
          email: 'john@example.com',
          password: '',
          role: Role.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          email: 'smith@example.com',
          password: '',
          role: Role.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.findAll(filterDto);

      expect(service.findAll).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const expectedResult: UserEntity = {
        id: 1,
        email: 'john@example.com',
        password: '',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (service.findOne as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.findOne(userId);

      expect(service.findOne).toHaveBeenCalledWith(+userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        email: 'john@example.com',
      };
      const expectedResult: UserEntity = {
        id: 1,
        email: 'john@example.com',
        password: '',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (service.update as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.update(userId, updateUserDto);

      expect(service.update).toHaveBeenCalledWith(+userId, updateUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';
      const expectedResult: UserEntity = {
        id: 1,
        email: 'john@example.com',
        password: '',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (service.remove as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.remove(userId);

      expect(service.remove).toHaveBeenCalledWith(+userId);
      expect(result).toEqual(expectedResult);
    });
  });
});

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
