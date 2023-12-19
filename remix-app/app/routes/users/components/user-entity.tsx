import { useFetcher } from '@remix-run/react';
import { useEffect } from 'react';
import { Permission } from '~/auth/auth.types';
import { RequirePermissions } from '~/components/require-permissions/require-permissions';
import { User } from '~/types/user.types';

type Props = {
  user: User;
  userPermissions: Permission[];
};

export const UserEntity = ({ user, userPermissions }: Props) => {
  const fetcher = useFetcher<{ isDeleteError?: boolean }>();
  const isDeleting = fetcher.state === 'submitting';
  const isLoading = !fetcher.data?.isDeleteError && fetcher.state === 'loading';

  useEffect(() => {
    if (!fetcher.data?.isDeleteError) return;
    fetcher.data.isDeleteError = false;
  }, [fetcher.data?.isDeleteError]);

  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.permissions.join(', ')}</td>
      <td>
        <RequirePermissions
          accessPermissions={[Permission.UM]}
          userPermissions={userPermissions}
        >
          <div className="flex gap-3">
            <button className="text-blue-800">Edit</button>
            {user.email !== 'admin@mail.com' && (
              <fetcher.Form method="post">
                <input type="hidden" name="id" value={user.id} />
                {isDeleting ? (
                  'Deleting...'
                ) : (
                  <button
                    className="text-blue-800"
                    name="_action"
                    value="delete-user"
                  >
                    Delete
                  </button>
                )}
              </fetcher.Form>
            )}
            {isLoading && <span>Loading...</span>}
          </div>
        </RequirePermissions>
      </td>
    </tr>
  );
};
