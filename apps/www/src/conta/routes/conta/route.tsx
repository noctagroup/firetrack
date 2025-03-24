import { Outlet } from "react-router"

import type { Route } from "./+types/route"
import stylesheetUrl from "./styles.css?url"

export function links() {
  return [
    {
      href: stylesheetUrl,
      rel: "stylesheet",
    },
  ] satisfies Route.LinkDescriptors
}

export default function Conta() {
  return (
    <div className="relative flex min-h-full items-center justify-center px-4 py-6">
      <div className="conta-gradient-backdrop" />

      <Outlet />
    </div>
  )
}
