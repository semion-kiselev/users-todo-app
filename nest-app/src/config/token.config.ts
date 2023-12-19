import { registerAs } from '@nestjs/config';

export default registerAs('token', () => ({
  secret: process.env.ACCESS_TOKEN_SECRET,
  expirationInSec: process.env.ACCESS_TOKEN_EXPIRATION_SECONDS,
}));
