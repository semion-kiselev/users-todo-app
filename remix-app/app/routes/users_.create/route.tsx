import { Form, NavLink, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/auth/auth.server";
import { createUser, getPermissions } from "~/api";
import { Permission } from "~/auth/auth.types";
import { AxiosError } from "axios";

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
    const errorData = (error as AxiosError).response?.data;
    return { error: errorData };
  }
}

export default function CreateUser() {
  const { permissions } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isCreating = navigation.state === "submitting";
  const isLoading = navigation.state === "loading";
  const createError = useActionData<typeof action>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }} className="bg-green-400 h-full">
      <h1>Create User</h1>
      {createError && (
        <div className="my-2 text-red-900">
          {JSON.stringify(createError)}
        </div>
      )}
      <p className="text-blue-800 font-bold">
        <NavLink to="/users">Back</NavLink>{" "}{isLoading && <span>Loading...</span>}
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
          {isCreating ? "Creating..." : (
            <button type="submit">Create</button>
          )}
        </div>
      </Form>
    </div>
  );
}
