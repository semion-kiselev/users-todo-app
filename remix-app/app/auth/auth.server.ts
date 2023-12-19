import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { login, LoginApiParams } from '~/api';
import { TokenPayload, AuthData } from '~/auth/auth.types';
import { sessionStorage } from './session.server';

export const authenticator = new Authenticator<AuthData>(sessionStorage, {
  throwOnError: true,
});

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email') || '';
    const password = form.get('password') || '';
    const data = await login({ email, password } as LoginApiParams);
    const tokenPayload: TokenPayload = JSON.parse(
      Buffer.from(data.token.split('.')[1], 'base64').toString(),
    );
    return {
      token: data.token,
      user: {
        id: tokenPayload.sub,
        name: tokenPayload.username,
        email: tokenPayload.email,
        permissions: tokenPayload.permissions,
      },
    };
  }),
  'user-pass',
);
