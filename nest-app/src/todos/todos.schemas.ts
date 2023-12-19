import { z } from 'zod';

export const CreateTodoPayloadSchema = z.object({
  name: z.string().min(2).max(255),
});

export const UpdateTodoPayloadSchema = CreateTodoPayloadSchema.partial().extend(
  {
    done: z.boolean().optional(),
  },
);

export const TodoIdSchema = z.number().positive().max(2147483647);
