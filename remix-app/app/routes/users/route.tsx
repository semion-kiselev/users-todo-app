import { NavLink, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/auth/auth.server";
import { getUsers } from "~/api";
import { User } from "~/types/user.types";
import { Permission } from "~/auth/auth.types";
import { RequirePermissions } from "~/components/require-permissions/require-permissions";

export async function loader({ request }: LoaderFunctionArgs) {
  const authData = await authenticator.isAuthenticated(request);
  if (!authData) {
    return redirect("/login");
  }

  let users: User[] = [];
  try {
    users = await getUsers({ token: authData.token });
  } catch (error) {
    console.log({ error });
  }

  return {
    users,
    authData
  }
}

export default function Users() {
  const { users, authData } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }} className="bg-red-400 h-full">
      <p className="text-blue-800 font-bold">
        <NavLink to="/">Back</NavLink>
      </p>
      <RequirePermissions accessPermissions={[Permission.UM]} userPermissions={authData.user.permissions}>
        <p className="text-blue-800 font-bold">
          <NavLink to="./create">Create User</NavLink>
        </p>
      </RequirePermissions>
      <h1>Users List</h1>
      {users && (
        <table>
          <thead>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Permissions</th>
            <th>Actions</th>
          </thead>
          <tbody>
          {users.map((u) => (
            <tr>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.permissions.join(", ")}</td>
              <td>
                <div className="flex gap-3">
                  <button className="text-blue-800">Edit</button>
                  <button className="text-blue-800">Delete</button>
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
