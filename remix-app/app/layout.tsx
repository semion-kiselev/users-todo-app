import { Form, NavLink } from '@remix-run/react';
import { ReactNode } from 'react';
import { Permission, UserFromToken } from '~/auth/auth.types';
import { RequirePermissions } from '~/components/require-permissions/require-permissions';

type Props = {
  user?: UserFromToken;
  children: ReactNode;
};

export const Layout = ({ children, user }: Props) => {
  return (
    <div className="h-full bg-fuchsia-600 p-4 flex flex-col">
      <h1>Root layout</h1>
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <RequirePermissions
            accessPermissions={[Permission.UR]}
            userPermissions={user?.permissions}
          >
            <p className="text-blue-800 font-bold">
              <NavLink to="/users">
                {({ isActive, isPending, isTransitioning }) => {
                  if (isActive) {
                    return <span className="text-green-800">Users</span>;
                  }
                  if (isPending) {
                    return <span>Users Loading...</span>;
                  }
                  if (isTransitioning) {
                    return <span>Users Transitioning...</span>;
                  }
                  return <span>Users</span>;
                }}
              </NavLink>
            </p>
          </RequirePermissions>
          <p className="text-blue-800 font-bold">
            <NavLink to="/about">About</NavLink>
          </p>
        </div>
        <div>
          {!user && (
            <p className="text-blue-800 font-bold">
              <NavLink to="/login">Login</NavLink>
            </p>
          )}
          {user && (
            <div className="text-blue-800 font-bold">
              <Form method="post">
                <button>Logout</button>
              </Form>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};
