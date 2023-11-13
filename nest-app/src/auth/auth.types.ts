import { z } from 'zod';
import { LoginSchema } from './auth.schemas';

export type LoginPayload = z.infer<typeof LoginSchema>;
