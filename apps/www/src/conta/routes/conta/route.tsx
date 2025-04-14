import { Waves } from "lucide-react"
import { Link, Outlet } from "react-router"

export default function Conta() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="space-y-4 p-6 md:p-10">
        <Link
          to="."
          className="flex items-center justify-center gap-1.5 font-medium md:justify-start">
          <Waves className="size-5" />
          <span>Firetrack</span>
        </Link>

        <div className="mx-auto max-w-sm">
          <Outlet />
        </div>
      </div>

      <div className="relative hidden lg:block">
        <img
          src="https://ui.shadcn.com/placeholder.svg"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
