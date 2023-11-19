import { NavLink, Form } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth/auth.server";

export default function Login() {
  return (
    <div className="bg-orange-600 h-full">
      <h1>Login</h1>
      <p className="text-blue-800 font-bold">
        <NavLink to="/">Back</NavLink>
      </p>
      <Form method="post">
        <p>
          <input type="email" name="email" required />
        </p>
        <p>
          <input
            name="password"
            required
          />
        </p>
        <p>
          <button>Login</button>
        </p>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}
