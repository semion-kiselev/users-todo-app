import { Injectable } from '@nestjs/common';
import * as format from 'pg-format';
import { DatabaseService } from '../database/database.service';
import { normalizeUser } from './users.utils';
import {
  User,
  UserFromDb,
  CreateUserPayloadType,
  UserWithPermissionsFromDb,
} from './users.types';
import { Pool } from 'pg';
import { toCamelCase } from '../utils/lib';

@Injectable()
export class UsersService {
  pool: Pool;

  constructor(private db: DatabaseService) {
    this.pool = this.db.getPool();
  }

  async createUser({
    name,
    email,
    password,
    permissions,
  }: CreateUserPayloadType): Promise<User> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const user = await client
        .query<UserFromDb>(
          `
              INSERT INTO employee (name, email, password)
              VALUES ($1, $2, crypt($3, gen_salt('bf')))
              RETURNING *;
          `,
          [name, email, password],
        )
        .then((result) => result.rows[0]);

      const userPermissionsMap = permissions.map((p) => [user.id, p]);
      await client.query<string[]>(
        format(
          `
              INSERT INTO employee_permission (employee_id, permission_id)
              VALUES %L
          `,
          userPermissionsMap,
        ),
      );

      await client.query('COMMIT');

      return normalizeUser({ ...user, permissions });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async getUser(id: number) {
    const result = await this.pool.query<UserWithPermissionsFromDb>(
      `
            SELECT id, name, email, created_at, updated_at, json_agg(ep.permission_id) as permissions
            FROM employee
                     JOIN employee_permission ep on employee.id = ep.employee_id
            WHERE id = $1
            GROUP BY id, name, email, created_at, updated_at;
        `,
      [id],
    );
    return result.rows[0];
  }

  async getUserByCredentials(login: string, password: string) {
    const result = await this.pool.query<UserWithPermissionsFromDb>(
      `
            SELECT id, name, email, created_at, updated_at, json_agg(ep.permission_id) as permissions
            FROM employee
                     JOIN employee_permission ep on employee.id = ep.employee_id
            WHERE email = $1 AND password = crypt($2, password)
            GROUP BY id, name, email, created_at, updated_at;
        `,
      [login, password],
    );
    const user = result.rows.length === 0 ? null : result.rows[0];
    return user ? toCamelCase(user) as User : null;
  }
}
