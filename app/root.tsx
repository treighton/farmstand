import type { 
  MetaFunction,
  LinksFunction, 
  LoaderFunction 
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";

import { CartProvider } from "./components/cartContext";

import remixImageStyles from "remix-image/remix-image.css";
import styles from "./styles.css";
import tailwind from "./tailwind.css";
import Header from "./components/header";

import { getUserSession } from "./utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: remixImageStyles },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Barbell Farm Stand",
  viewport: "width=device-width,initial-scale=1",
});

export const loader:LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request);

  return (await session.get('idToken')) || null;
};

export default function App() {
  const user  = useLoaderData() 

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;900&family=Ubuntu:wght@300&display=swap" rel="stylesheet" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header user={user} />
          <div className="flex flex-1 flex-col bg-light">
            <Outlet />
          </div>
          <div className="footer bg-dark text-white flex items-center justify-center p-4">
            <p>&copy; 2022</p>
          </div>
        </CartProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
