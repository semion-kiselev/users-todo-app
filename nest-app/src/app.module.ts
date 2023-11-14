import { Module } from '@nestjs/common';
import { APP_FILTER } from "@nestjs/core";
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import tokenConfig from './config/token.config';
import { DatabaseModule } from './database/database.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from "./errors/global-exceprion-filter.filter";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, tokenConfig],
    }),
    DatabaseModule,
    PermissionsModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ]
})
export class AppModule {}
