import { QueryClientProvider } from "@tanstack/react-query"
import { Waves } from "lucide-react"
import { Links, Meta, Outlet, replace, Scripts, ScrollRestoration } from "react-router"

import { contaOptions } from "~conta/queries"
import faviconUrl from "~shared/assets/favicon.svg?url"
import { ThemeProvider, ThemeProviderScript } from "~shared/hooks/use-theme"
import { queryClient } from "~shared/lib/query/client"
import { Toaster } from "~shared/lib/shadcn/ui/sonner"
import tailwindUrl from "~shared/styles/tailwind.css?url"

import type { Route } from "./+types/root"

export function links() {
  return [
    {
      rel: "icon",
      type: "image/svg+xml",
      sizes: "any",
      href: faviconUrl,
    },
    {
      rel: "stylesheet",
      href: tailwindUrl,
    },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
      rel: "stylesheet",
    },
  ] satisfies Route.LinkDescriptors
}

export function meta() {
  return [
    { title: "Firetrack" },
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ] satisfies Route.MetaDescriptors
}

export async function clientLoader(args: Route.ClientLoaderArgs) {
  const url = new URL(args.request.url)

  try {
    const conta = await queryClient.ensureQueryData(contaOptions.conta())

    if (conta.is_authenticated && !url.pathname.startsWith("/fenomeno")) {
      return replace("/fenomeno")
    }
  } catch {
    if (!url.pathname.startsWith("/conta")) {
      return replace("/conta")
    }
  }

  return null
}

export default function App() {
  return <Outlet />
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="pt-br">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ScrollRestoration />
        <Scripts />
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ThemeProviderScript />
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}

export function HydrateFallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <Waves className="size-36 animate-bounce ease-out" />
    </div>
  )
}
