export enum Permission {
  UR = "UR",
  UM = "UM",
}

export type TokenPayload = {
  sub: number,
  username: string,
  email: string,
  permissions: Permission[],
  iat: number,
  exp: number
};

export type UserFromToken = {
  id: number,
  name: string,
  email: string,
  permissions: Permission[],
};

export type AuthData = {
  token: string;
  user: UserFromToken;
};

