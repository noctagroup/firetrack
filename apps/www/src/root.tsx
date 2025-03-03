import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"

import tailwindUrl from "~/assets/styles/tailwind.css?url"

import type { Route } from "./+types/root"

export const meta: Route.MetaFunction = () => [
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
]

export const links: Route.LinksFunction = () => [{ href: tailwindUrl, rel: "stylesheet" }]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
