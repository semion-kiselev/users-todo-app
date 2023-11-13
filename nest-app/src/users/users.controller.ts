import { Body, Controller, Post } from '@nestjs/common';
import { ZodPipe } from '../pipes/zod-pipe';
import { UsersService } from './users.service';
import { CreateUserPayload } from './users.schemas';
import { Permissions } from '../auth/auth.decorators';
import { CreateUserPayloadType, User } from './users.types';
import { Permission } from '../auth/auth.constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // todo: catch 409
  @Post()
  @Permissions(Permission.UM)
  createUser(
    @Body(new ZodPipe(CreateUserPayload)) payload: CreateUserPayloadType,
  ): Promise<User> {
    return this.usersService.createUser(payload);
  }
}
