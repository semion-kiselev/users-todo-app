import { Form, NavLink } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/auth/auth.server";
import { createUser } from "~/api";
import { Permission } from "~/auth/auth.types";

export default function CreateUser() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }} className="bg-green-400 h-full">
      <h1>Create User</h1>
      <p className="text-blue-800 font-bold">
        <NavLink to="/users">Back</NavLink>
      </p>
      <Form>

      </Form>
    </div>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const authData = await authenticator.isAuthenticated(request);
  if (!authData) {
    return redirect("/login");
  }
  if (!authData.user.permissions.includes(Permission.UM)) {
    return redirect("/");
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const data = await authenticator.isAuthenticated(request);
  if (!data) return;

  // todo: get form fata & send create request & redirect back
}
