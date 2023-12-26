import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

export const getPathname = (headersList: ReadonlyHeaders) => {
  const domain = headersList.get('host') || '';
  const fullUrl = headersList.get('x-url') || '';

  const [, pathname] =
    fullUrl.match(new RegExp(`https?:\/\/${domain}(.*)`)) || [];
  return pathname;
};
