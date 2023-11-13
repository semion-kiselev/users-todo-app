import { z } from 'zod';

export const CreateUserPayloadSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
  permissions: z.array(z.string().length(2)).min(1),
});

export const UpdateUserPayloadSchema = CreateUserPayloadSchema.partial();

export const DeleteUserParamsSchema = z.object({
  id: z.coerce.number().positive().max(2147483647),
});

export const GetUserParamsSchema = z.object({
  id: z.coerce.number().positive().max(2147483647),
});
