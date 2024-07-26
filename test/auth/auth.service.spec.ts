import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../../src/auth/dto/register.dto';
import { LoginDto } from '../../src/auth/dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockImplementation(() => Promise.resolve('hashed-password')),
  compare: jest
    .fn()
    .mockImplementation((password) => Promise.resolve(password === 'password')),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registration', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = await bcrypt.hash(registerDto.password, 7);
      const user = {
        id: 1,
        email: registerDto.email,
        password: hashedPassword,
        role: 'USER',
      };
      const token = 'jwt-token';

      (usersService.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.createUser as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      const result = await service.registration(registerDto);

      expect(usersService.getUserByEmail).toHaveBeenCalledWith(
        registerDto.email,
      );
      expect(usersService.createUser).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        id: user.id,
        role: user.role,
      });
      expect(result).toEqual({ token });
    });

    it('should throw an error if user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const existingUser = {
        id: 1,
        email: registerDto.email,
        password: 'hashed-password',
        role: 'USER',
      };

      (usersService.getUserByEmail as jest.Mock).mockResolvedValue(
        existingUser,
      );

      await expect(service.registration(registerDto)).rejects.toThrow(
        new HttpException(
          'User with such email already exists',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = await bcrypt.hash(loginDto.password, 7);
      const user = {
        id: 1,
        email: loginDto.email,
        password: hashedPassword,
        name: 'Test User',
        role: 'USER',
      };
      const token = 'jwt-token';

      (usersService.getUserByEmail as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      const result = await service.login(loginDto);

      expect(usersService.getUserByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        id: user.id,
        role: user.role,
      });
      expect(result).toEqual({ token });
    });

    it('should throw an error if user does not exist', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      (usersService.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new HttpException(
          'User with such email already exists',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error if password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };
      const user = {
        id: 1,
        email: loginDto.email,
        password: await bcrypt.hash('correct-passwrod', 7),
        name: 'Test User',
        role: 'USER',
      };

      (usersService.getUserByEmail as jest.Mock).mockResolvedValue(user);

      await expect(service.login(loginDto)).rejects.toThrow(
        new HttpException('Wrong password', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
