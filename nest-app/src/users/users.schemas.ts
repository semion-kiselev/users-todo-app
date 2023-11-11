import { z } from 'zod';

export const CreateUserPayload = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
  permissions: z.array(z.string().length(2)).min(1),
});

export const UpdateUserPayload = CreateUserPayload.partial();

export const DeleteUserParams = z.object({
  id: z.coerce.number().positive().max(2147483647),
});

export const GetUserParams = z.object({
  id: z.coerce.number().positive().max(2147483647),
});
