import axios from "axios";

const client = axios.create({
  baseURL: 'http://localhost:3456',
});

export type LoginApiParams = {
  email: string;
  password: string;
};
export const login = ({ email, password }: LoginApiParams) =>
  client.post<{ token: string }>('/auth/login', { email, password }).then(res => res.data);
