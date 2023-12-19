import { ReactNode } from 'react';
import { Permission } from '~/auth/auth.types';

type Props = {
  userPermissions?: Permission[];
  accessPermissions: Permission[];
  children: ReactNode;
};

export const RequirePermissions = ({
  children,
  userPermissions,
  accessPermissions,
}: Props) => {
  if (!userPermissions) {
    return null;
  }
  const hasPermissions = accessPermissions.every((p) =>
    userPermissions.includes(p),
  );
  return hasPermissions ? children : null;
};
