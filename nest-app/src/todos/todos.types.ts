import { z } from 'zod';
import {
  CreateTodoPayloadSchema,
  UpdateTodoPayloadSchema,
} from './todos.schemas';

export type Todo = {
  id: number;
  name: string;
  done: boolean;
};

export type CreateTodoPayload = z.infer<typeof CreateTodoPayloadSchema>;
export type UpdateTodoPayload = z.infer<typeof UpdateTodoPayloadSchema>;
