import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import {login, LoginApiParams} from "~/api";

export const authenticator = new Authenticator<string>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") || '';
    const password = form.get("password") || '';
    // todo: handle errors
    const token = await login({ email, password } as LoginApiParams);
    console.log({ token });
    return token;
  }),
  "user-pass"
);