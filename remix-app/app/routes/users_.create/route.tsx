import { Form, NavLink, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/auth/auth.server";
import { createUser, CreateUserData, getPermissions } from "~/api";
import { Permission } from "~/auth/auth.types";

export async function loader({ request }: LoaderFunctionArgs) {
  const authData = await authenticator.isAuthenticated(request);
  if (!authData) {
    return redirect("/login");
  }
  if (!authData.user.permissions.includes(Permission.UM)) {
    return redirect("/");
  }
  const permissions = await getPermissions({ token: authData.token });
  return { permissions };
}

export async function action({ request }: ActionFunctionArgs) {
  const authData = await authenticator.isAuthenticated(request);
  if (!authData) return;

  const formData = await request.formData();
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    permissions: formData.getAll("permissions") as string[],
  };

  try {
    await createUser({ token: authData.token, data });
    return redirect("/users");
  } catch (error) {
    // todo: handle error
    console.log(error);
  }

  return null;
}

export default function CreateUser() {
  const { permissions } = useLoaderData<typeof loader>();

  // todo: pending state

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }} className="bg-green-400 h-full">
      <h1>Create User</h1>
      <p className="text-blue-800 font-bold">
        <NavLink to="/users">Back</NavLink>
      </p>
      <Form method="post">
        <label htmlFor="name" className="block">Name:</label>
        <div>
          <input type="text" name="name" className="border-2 border-gray-600 px-2 w-60" />
        </div>
        <br />
        <label htmlFor="email" className="block">Email:</label>
        <div>
          <input type="text" name="email" className="border-2 border-gray-600 px-2 w-60" />
        </div>
        <br />
        <label htmlFor="password" className="block">Password:</label>
        <div>
          <input type="text" name="password" className="border-2 border-gray-600 px-2 w-60" />
        </div>
        <br />
        <label htmlFor="permissions" className="block">Permissions</label>
        <div>
          <select
            name="permissions"
            multiple
            className="border-2 border-gray-600 px-2  w-60"
          >
            {permissions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <br/>
        <div>
          <button type="submit">Create</button>
        </div>
      </Form>
    </div>
  );
}
