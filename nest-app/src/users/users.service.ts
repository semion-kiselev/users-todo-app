import { Injectable } from '@nestjs/common';
import * as format from 'pg-format';
import { DatabaseService } from '../database/database.service';
import { normalizeUser } from "./users.utils";
import { User, UserFromDb, CreateUserPayloadType } from './users.types';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async createUser({
    name,
    email,
    password,
    permissions,
  }: CreateUserPayloadType): Promise<User> {
    const pool = this.db.getPool();
    const client = await pool.connect();

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
      INSERT INTO employee_permission (employee_id, permission_id) VALUES %L
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
}
