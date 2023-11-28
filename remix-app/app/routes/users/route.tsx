import { NavLink, useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/auth/auth.server";
import { deleteUser, getUsers } from "~/api";
import { Permission } from "~/auth/auth.types";
import { RequirePermissions } from "~/components/require-permissions/require-permissions";
import { UserEntity } from "~/routes/users/components/user-entity";

export async function loader(args: LoaderFunctionArgs) {
  console.log("LOAD USERS");
  const { request } = args;
  const authData = await authenticator.isAuthenticated(request);
  if (!authData) {
    return redirect("/login");
  }

  try {
    const users = await getUsers({ token: authData.token });
    return {
      users,
      authData,
      isUsersListError: false
    }
  } catch (error) {
    return { users: null, authData, isUsersListError: true };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const authData = await authenticator.isAuthenticated(request);
  if (!authData) return;

  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "delete-user") {
    const data = {
      token: authData.token,
      id: Number(formData.get("id")),
    };

    try {
      return await deleteUser(data);
    } catch (error) {
      return { isDeleteError: true };
    }
  }

  return null;
}

export function shouldRevalidate({ actionResult, defaultShouldRevalidate }: any) {
  if (actionResult?.isDeleteError) {
    return false;
  }
  return defaultShouldRevalidate;
}

export default function Users() {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }} className="bg-red-400 h-full">
      <p className="text-blue-800 font-bold">
        <NavLink to="/">Back</NavLink>
      </p>

      <RequirePermissions accessPermissions={[Permission.UM]} userPermissions={data.authData.user.permissions}>
        <p className="text-blue-800 font-bold">
          <NavLink to="./create">Create User</NavLink>
        </p>
      </RequirePermissions>

      {data.isUsersListError && (
        <div className="text-red-900">Could not load users</div>
      )}

      {data.users && (
        <>
          <h1>Users List</h1>
          <table>
            <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {data.users.map((user) => (
              <UserEntity key={user.id} user={user} userPermissions={data.authData.user.permissions} />
            ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
