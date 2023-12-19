import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { NavLink, Form, useActionData } from '@remix-run/react';
import { AuthorizationError } from 'remix-auth';
import { authenticator } from '~/auth/auth.server';

export default function Login() {
  const data = useActionData<typeof action>();
  const isError = typeof data === 'object' && 'error' in data;

  return (
    <div className="bg-orange-600 h-full">
      <h1>Login</h1>
      <div className="text-blue-800 font-bold">
        <NavLink to="/">Back</NavLink>
      </div>

      {isError && (
        <div className="my-3 text-red-900">Incorrect email or password</div>
      )}

      <Form method="post">
        <div className="mt-2">
          <div>Email:</div>
          <input type="email" name="email" required />
        </div>
        <div className="mt-2">
          <div>Password:</div>
          <input name="password" required />
        </div>
        <div className="mt-2">
          <button>Send</button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate('user-pass', request, {
      successRedirect: '/',
    });
  } catch (err) {
    if (err instanceof Response) return err;
    if (err instanceof AuthorizationError) {
      // err.cause.response.data
      return { error: true };
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });
}
