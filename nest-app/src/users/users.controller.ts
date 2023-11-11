import { Body, Controller, Post } from '@nestjs/common';
import { ZodPipe } from '../pipes/zod-pipe';
import { UsersService } from './users.service';
import { CreateUserPayload } from './users.schemas';
import { CreateUserPayloadType, User } from './users.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // todo: add rbac
  @Post()
  createUser(
    @Body(new ZodPipe(CreateUserPayload)) payload: CreateUserPayloadType,
  ): Promise<User> {
    return this.usersService.createUser(payload);
  }
}
