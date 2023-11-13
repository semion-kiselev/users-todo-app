import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodPipe } from '../pipes/zod-pipe';
import { LoginSchema } from './auth.schemas';
import { LoginPayload } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body(new ZodPipe(LoginSchema)) payload: LoginPayload) {
    return this.authService.login(payload);
  }
}
