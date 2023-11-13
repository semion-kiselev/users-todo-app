import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async login({ email, password }: LoginPayload) {
    const user = await this.usersService.getUserByCredentials(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.name, email: user.email, permissions: user.permissions };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
