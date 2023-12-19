import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import tokenConfig from './config/token.config';
import { DatabaseModule } from './database/database.module';
import { GlobalExceptionFilter } from './errors/global-exceprion-filter.filter';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { TodosModule } from "./todos/todos.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, tokenConfig],
    }),
    DatabaseModule,
    PermissionsModule,
    UsersModule,
    TodosModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
