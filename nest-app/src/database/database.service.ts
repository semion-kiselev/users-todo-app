import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      user: this.configService.get<string>('database.user'),
      database: this.configService.get<string>('database.name'),
      port: Number(this.configService.get<string>('database.port')),
      host: this.configService.get<string>('database.host'),
    });
  }

  getPool(): Pool {
    return this.pool;
  }
}
