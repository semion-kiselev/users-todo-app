import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ZodPipe } from '../pipes/zod-pipe';
import {
  CreateTodoPayloadSchema,
  TodoIdSchema,
  UpdateTodoPayloadSchema,
} from './todos.schemas';
import { TodosService } from './todos.service';
import { CreateTodoPayload, Todo, UpdateTodoPayload } from './todos.types';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  createTodo(
    @Body(new ZodPipe(CreateTodoPayloadSchema)) payload: CreateTodoPayload,
  ): Promise<Todo> {
    return this.todosService.createTodo(payload);
  }

  @Put(':id')
  updateTodo(
    @Param('id', ParseIntPipe, new ZodPipe(TodoIdSchema)) id: number,
    @Body(new ZodPipe(UpdateTodoPayloadSchema)) payload: UpdateTodoPayload,
  ): Promise<Todo> {
    return this.todosService.updateTodo(id, payload);
  }

  @Get()
  getTodos() {
    return this.todosService.getTodos();
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe, new ZodPipe(TodoIdSchema)) id: number) {
    return this.todosService.deleteTodo(id);
  }
}
