import { Request } from 'express';
import { z } from 'zod';
import { LoginSchema } from './auth.schemas';

export type LoginPayload = z.infer<typeof LoginSchema>;

export type TokenPayload = {
  sub: number;
  username: string;
  email: string;
  permissions: string[];
  iat: number;
  exp: number;
};

export type TokenUser = {
  id: number;
  name: string;
  email: string;
  permissions: string[];
};

export type RequestWithUser = Request & { user: TokenUser };
