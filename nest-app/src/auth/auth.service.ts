import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {LoginPayload, TokenUser} from './auth.types';
import {DatabaseService} from "../database/database.service";
import {Pool} from "pg";

@Injectable()
export class AuthService {
  pool: Pool;

  constructor(private usersService: UsersService, private jwtService: JwtService, private db: DatabaseService) {
    this.pool = this.db.getPool();
  }

  async login({ email, password }: LoginPayload) {
    const user = await this.usersService.getUserByCredentials(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.name, email: user.email, permissions: user.permissions };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }

  async logout(userId: number) {
    await this.pool.query(
      "UPDATE employee SET token_expired_at=now()::timestamptz WHERE id = $1",
      [userId],
    );
    return {};
  }
}
