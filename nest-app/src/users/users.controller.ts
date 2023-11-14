import { Body, Controller, Get, Post, Put, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ZodPipe } from '../pipes/zod-pipe';
import { UsersService } from './users.service';
import {CreateUserPayloadSchema, UpdateUserPayloadSchema, UserIdSchema} from './users.schemas';
import { Permissions } from '../auth/auth.decorators';
import { CreateUserPayload, User } from './users.types';
import { Permission } from '../auth/auth.constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // todo: catch 409
  @Post()
  @Permissions(Permission.UM)
  createUser(
    @Body(new ZodPipe(CreateUserPayloadSchema)) payload: CreateUserPayload,
  ): Promise<User> {
    return this.usersService.createUser(payload);
  }

  // todo: catch 409, catchFKViolation?
  @Put(':id')
  @Permissions(Permission.UM)
  updateUser(
    @Param('id', ParseIntPipe, new ZodPipe(UserIdSchema)) id: number,
    @Body(new ZodPipe(UpdateUserPayloadSchema)) payload: CreateUserPayload,
  ): Promise<User> {
    return this.usersService.updateUser(id, payload);
  }

  @Get()
  @Permissions(Permission.UR)
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @Permissions(Permission.UR)
  getUser(@Param('id', ParseIntPipe, new ZodPipe(UserIdSchema)) id: number) {
    return this.usersService.getUser(id);
  }

  @Delete(':id')
  @Permissions(Permission.UM)
  deleteUser(@Param('id', ParseIntPipe, new ZodPipe(UserIdSchema)) id: number) {
    return this.usersService.deleteUser(id);
  }
}
