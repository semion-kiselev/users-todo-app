import axios from 'axios';
import { PermissionItem } from '~/auth/auth.types';
import { User } from '~/types/user.types';

const sleep = (time: number = 1000) =>
  new Promise((res) => setTimeout(res, time));

const client = axios.create({
  baseURL: 'http://localhost:3456',
});

// Login

export type LoginApiParams = {
  email: string;
  password: string;
};

export const login = ({ email, password }: LoginApiParams) =>
  client
    .post<{ token: string }>('/auth/login', { email, password })
    .then((res) => res.data);

// Logout

export type LogoutApiParams = {
  id: number;
};

export const logout = ({ id }: LogoutApiParams) =>
  client.post<null>('/auth/logout', { id }).then((res) => res.data);

// Get Permissions

export const getPermissions = ({ token }: GetUsersApiParams) =>
  client
    .get<PermissionItem[]>('/permissions', {
      headers: { authorization: `Bearer ${token}` },
    })
    .then((r) => r.data);

// Get Users

type GetUsersApiParams = {
  token: string;
};
export const getUsers = async ({ token }: GetUsersApiParams) => {
  await sleep(2000);
  // return Promise.reject(new Error("fail"));
  return client
    .get<User[]>('/users', {
      headers: { authorization: `Bearer ${token}` },
    })
    .then((r) => r.data);
};

// Create User

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  permissions: string[];
};

export type CreateUserApiParams = {
  token: string;
  data: CreateUserData;
};

export const createUser = async ({ token, data }: CreateUserApiParams) => {
  await sleep();
  return client
    .post<User>('/users', data, {
      headers: { authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
};

// Update User

type UpdateUserData = Partial<CreateUserData>;

export type UpdateUserApiParams = {
  token: string;
  id: number;
  data: UpdateUserData;
};

export const updateUser = ({ token, id, data }: UpdateUserApiParams) =>
  client
    .put<User>(`/users/${id}`, data, {
      headers: { authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);

// Delete User

type DeleteUserApiParams = {
  token: string;
  id: number;
};

export const deleteUser = async ({ token, id }: DeleteUserApiParams) => {
  await sleep();
  // return Promise.reject(new Error("fail"));
  return client
    .delete<null>(`/users/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
};
