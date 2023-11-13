import { Controller, Get, Post, Body, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Permissions } from "./auth.decorators";
import { AuthService } from './auth.service';
import { ZodPipe } from '../pipes/zod-pipe';
import { LoginSchema } from './auth.schemas';
import {LoginPayload, RequestWithUser} from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body(new ZodPipe(LoginSchema)) payload: LoginPayload) {
    return this.authService.login(payload);
  }

  @Get('logout')
  @Permissions()
  logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user.id);
  }
}
