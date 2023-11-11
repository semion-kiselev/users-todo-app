import { UserWithPermissionsFromDb, User } from "./users.types";
import { omit, toCamelCase } from "../utils/lib";

export const normalizeUser = (user: UserWithPermissionsFromDb) =>
  toCamelCase(omit(user, ["token_expired_at", "password"])) as User;
