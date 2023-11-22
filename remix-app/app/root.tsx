import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import styles from "./global.css";
import { Layout } from "./layout";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth/auth.server";
import { logout } from "~/api";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en" style={{ height: '100%' }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Layout user={data?.user}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request);
}

export async function action({ request }: ActionFunctionArgs) {
  const data = await authenticator.isAuthenticated(request);
  if (!data) return;

  await logout({ token: data.token });
  return await authenticator.logout(request, { redirectTo: "/" });
}
