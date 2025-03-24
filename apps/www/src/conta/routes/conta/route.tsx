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
    <div className="relative h-full">
      <div className="conta-gradient-backdrop" />

      <div className="pt-[7%]">
        <Outlet />
      </div>
    </div>
  )
}
