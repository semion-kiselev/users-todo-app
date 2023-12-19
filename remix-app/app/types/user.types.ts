import { Permission } from '~/auth/auth.types';

export type User = {
  id: number;
  name: string;
  email: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
};
