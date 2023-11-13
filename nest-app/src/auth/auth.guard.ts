import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Permission } from './auth.constants';
import { PERMISSIONS_KEY } from './auth.decorators';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './auth.types';
import {DatabaseService} from "../database/database.service";
import {Pool} from "pg";

@Injectable()
export class AuthGuard implements CanActivate {
  pool: Pool;

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    private db: DatabaseService
  ) {
    this.pool = this.db.getPool();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = await this.jwtService
      .verifyAsync<TokenPayload>(token, {
        secret: this.configService.get<string>('token.secret'),
      })
      .catch(() => {
        throw new UnauthorizedException();
      });

    const user = {
      id: payload.sub,
      name: payload.username,
      email: payload.email,
      permissions: payload.permissions,
    };

    const userTokenExpiredTime = await this.getUserTokenExpirationTime(user.id);

    if (payload.iat <= userTokenExpiredTime) {
      throw new UnauthorizedException();
    }

    request['user'] = user;

    if (Array.isArray(requiredPermissions) && requiredPermissions.length === 0) {
      return true;
    }

    return requiredPermissions.every(
      (permission) => user.permissions.includes(permission),
    );
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async getUserTokenExpirationTime(userId: number) {
    const token_expired_at = await this.pool
      .query<{ token_expired_at: string }>(
        "SELECT token_expired_at FROM employee WHERE id = $1",
        [userId],
      )
      .then((result) => result.rows[0].token_expired_at);

    return Math.ceil(new Date(token_expired_at).getTime() / 1000);
  }
}
