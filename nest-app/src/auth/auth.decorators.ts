import { SetMetadata } from '@nestjs/common';
import { Permission } from "./auth.constants";

export const Permissions = (...permissions: Permission[]) => SetMetadata('permissions', permissions);
