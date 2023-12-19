import { omit, toCamelCase } from '../utils/lib';
import { UserWithPermissionsFromDb, User } from './users.types';

export const normalizeUser = (user: UserWithPermissionsFromDb) =>
  toCamelCase(omit(user, ['token_expired_at', 'password'])) as User;
