import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entities/auth.entity';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User registration' })
  @ApiCreatedResponse({ type: AuthEntity })
  @Post('register')
  registration(@Body() registerDto: RegisterDto) {
    return this.authService.registration(registerDto);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({ type: AuthEntity })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
