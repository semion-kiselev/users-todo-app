import { Controller, Get } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permission } from "./permissions.types";

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  getPermissions(): Promise<Permission[]> {
    return this.permissionsService.getPermissions();
  }
}
