import { LoaderPinwheel } from "lucide-react"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"

import tailwindUrl from "~/assets/styles/tailwind.css?url"

import type { Route } from "./+types/root"

export const meta: Route.MetaFunction = () => [
  { title: "Firetrack" },
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
        <ScrollRestoration />
        <Scripts />
        {children}
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function HydrateFallback() {
  return (
    <div className="h-full flex items-center flex-col gap-3 justify-center">
      <LoaderPinwheel className="animate-spin size-36 ease-in-out" strokeWidth={1.5} />
    </div>
  )
}
