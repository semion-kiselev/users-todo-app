import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
}));
