import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please, enter correct email' }),
  password: z.string().max(255),
});
