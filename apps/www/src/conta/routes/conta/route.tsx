import { Waves } from "lucide-react"
import { Link, Outlet } from "react-router"

export default function Conta() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div>
        <div className="bg-background/60 sticky inset-x-0 top-0 flex items-center justify-center px-6 py-4 backdrop-blur-lg md:justify-start md:px-10">
          <Link to="." className="flex items-center gap-1.5 font-semibold">
            <Waves className="size-5" />
            <span>Firetrack</span>
          </Link>
        </div>

        <div className="mx-auto my-6 max-w-md p-6 md:my-8 md:max-w-lg md:p-10 lg:my-12">
          <Outlet />
        </div>
      </div>

      <div className="relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1574980362852-67795d06a31b"
          className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
