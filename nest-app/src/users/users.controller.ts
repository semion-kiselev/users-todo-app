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
import { Permission } from '../auth/auth.constants';
import { Permissions } from '../auth/auth.decorators';
import { ZodPipe } from '../pipes/zod-pipe';
import {
  CreateUserPayloadSchema,
  UpdateUserPayloadSchema,
  UserIdSchema,
} from './users.schemas';
import { UsersService } from './users.service';
import { CreateUserPayload, User } from './users.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permissions(Permission.UM)
  createUser(
    @Body(new ZodPipe(CreateUserPayloadSchema)) payload: CreateUserPayload,
  ): Promise<User> {
    return this.usersService.createUser(payload);
  }

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
