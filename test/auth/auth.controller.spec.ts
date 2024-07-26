import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { RegisterDto } from '../../src/auth/dto/register.dto';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { AuthEntity } from '../../src/auth/entities/auth.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registration: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registration', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const expectedResult: AuthEntity = {
        jwtToken: 'jwt-token',
      };

      (service.registration as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.registration(registerDto);

      expect(service.registration).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const expectedResult: AuthEntity = {
        jwtToken: 'jwt-token',
      };

      (service.login as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
