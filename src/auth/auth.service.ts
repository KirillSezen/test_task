import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registration(registerDto: RegisterDto) {
    const candidate = await this.userService.getUserByEmail(registerDto.email);
    if (candidate) {
      throw new HttpException(
        'User with such email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(registerDto.password, 7);
    const user = await this.userService.createUser({
      ...registerDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user);
  }

  private async generateToken(user) {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(registerDto: RegisterDto) {
    const user = await this.userService.getUserByEmail(registerDto.email);
    if (!user) {
      throw new HttpException(
        'User with such email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const compare = await bcrypt.compare(registerDto.password, user.password);
    if (!compare) {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
