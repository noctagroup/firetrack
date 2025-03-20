import { QueryClientProvider } from "@tanstack/react-query"
import { LoaderPinwheel } from "lucide-react"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"

import { contaOptions } from "~conta/queries"
import { queryClient } from "~shared/lib/query"
import { Toaster } from "~shared/lib/shadcn/ui/sonner"
import tailwindUrl from "~shared/styles/tailwind.css?url"

import type { Route } from "./+types/root"

export function meta() {
  return [
    { title: "Firetrack" },
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ] satisfies Route.MetaDescriptors
}

export function links() {
  return [
    {
      href: tailwindUrl,
      rel: "stylesheet",
    },
  ] satisfies Route.LinkDescriptors
}

export async function clientLoader() {
  await queryClient.prefetchQuery(contaOptions.minhaConta())
}

export default function App() {
  return <Outlet />
}

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
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  )
}

export function HydrateFallback() {
  return (
    <div className="h-full flex items-center flex-col gap-3 justify-center">
      <LoaderPinwheel className="animate-spin size-36 ease-in-out" strokeWidth={1.5} />
    </div>
  )
}
