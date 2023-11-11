import { z } from "zod";
import {
  CreateUserPayload,
  UpdateUserPayload,
} from "./users.schemas";

export type User = {
  id: number;
  name: string;
  email: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};

export type UserFromDb = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  token_expired_at: string;
};

export type UserWithPermissionsFromDb = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  token_expired_at: string;
  permissions: string[];
};

export type CreateUserPayloadType = z.infer<typeof CreateUserPayload>;
export type UpdateUserPayloadType = z.infer<typeof UpdateUserPayload>;

export type DeleteUserParamsType = {
  id: string;
};

export type GetUserParamsType = {
  id: string;
};

export type UpdateUserParamsType = {
  id: string;
};
