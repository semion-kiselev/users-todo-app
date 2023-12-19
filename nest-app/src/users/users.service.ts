import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import * as format from 'pg-format';
import { DatabaseService } from '../database/database.service';
import { toCamelCase } from '../utils/lib';
import { getSqlWithValuesForUpdate } from '../utils/sql';
import {
  addPermissionsSql,
  addUserPermissionsSql,
  createUserSql,
  deleteUserSql,
  getUserByCredentialsSql,
  getUserPermissionsSql,
  getUserSql,
  getUsersSql,
  removeUserPermissionsSql,
  updateUserSql,
} from './users.sql';
import {
  User,
  UserFromDb,
  CreateUserPayload,
  UserWithPermissionsFromDb,
  UpdateUserPayload,
} from './users.types';
import { normalizeUser } from './users.utils';

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
  }: CreateUserPayload): Promise<User> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const user = await client
        .query<UserFromDb>(createUserSql, [name, email, password])
        .then((result) => result.rows[0]);

      const userPermissionsMap = permissions.map((p) => [user.id, p]);
      await client.query<string[]>(
        format(addPermissionsSql, userPermissionsMap),
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

  async updateUser(
    id: number,
    { name, email, password, permissions }: UpdateUserPayload,
  ) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const [formattedSql, values] = getSqlWithValuesForUpdate(
        updateUserSql,
        {
          name,
          email,
          password,
          token_expired_at: permissions ? 'now()::timestamptz' : undefined,
        },
        [id],
      );

      const updateResult = await client.query<UserFromDb>(formattedSql, values);

      if (updateResult.rowCount === 0) {
        throw new NotFoundException();
      }

      const user = updateResult.rows[0];

      if (permissions) {
        const userPermissionsMap = permissions?.map((p) => [user.id, p]);

        await client.query(removeUserPermissionsSql, [id]);

        await client.query<string[]>(
          format(addUserPermissionsSql, userPermissionsMap),
        );
      }

      let currentPermissions: string[] = [];
      if (!permissions) {
        currentPermissions = await this.getUserPermissions(id);
      }

      await client.query('COMMIT');

      return normalizeUser({
        ...user,
        permissions: permissions || currentPermissions,
      });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async getUsers() {
    const result =
      await this.pool.query<UserWithPermissionsFromDb>(getUsersSql);
    return result.rows.map(toCamelCase) as User[];
  }

  async getUser(id: number) {
    const result = await this.pool.query<UserWithPermissionsFromDb>(
      getUserSql,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException();
    }

    const user = result.rows[0];
    return toCamelCase(user) as User;
  }

  async getUserByCredentials(login: string, password: string) {
    const result = await this.pool.query<UserWithPermissionsFromDb>(
      getUserByCredentialsSql,
      [login, password],
    );
    const user = result.rows.length === 0 ? null : result.rows[0];
    return user ? (toCamelCase(user) as User) : null;
  }

  async deleteUser(id: number) {
    const result = await this.pool.query(deleteUserSql, [id]);

    if (result.rowCount === 0) {
      throw new NotFoundException();
    }

    return null;
  }

  private async getUserPermissions(userId: number) {
    const result = await this.pool.query(getUserPermissionsSql, [userId]);
    return result.rows[0].permissions;
  }
}
