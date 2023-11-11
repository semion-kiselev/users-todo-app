import { Injectable } from '@nestjs/common';
import { Permission } from './permissions.types';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PermissionsService {
  constructor(private db: DatabaseService) {}

  async getPermissions(): Promise<Permission[]> {
    const result = await this.db.getPool().query<Permission>(
      `
          SELECT id, name FROM permission;
    `,
    );
    return result.rows;
  }
}
