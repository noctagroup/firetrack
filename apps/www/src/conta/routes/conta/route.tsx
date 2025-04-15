import { Waves } from "lucide-react"
import { Link, Outlet } from "react-router"

export default function Conta() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div>
        <div className="bg-background/60 sticky inset-x-0 top-0 flex items-center justify-center px-6 py-4 backdrop-blur-lg md:justify-start md:px-10">
          <Link to="." className="flex items-center gap-1.5 font-medium">
            <Waves className="size-5" />
            <span>Firetrack</span>
          </Link>
        </div>

        <div className="mx-auto my-6 max-w-md p-6 md:my-8 md:max-w-lg md:p-10 lg:my-12">
          <Outlet />
        </div>
      </div>

      <div className="relative hidden lg:block">
        {/* TODO: colocar uma imagem bonita aqui */}
        <img
          src="https://ui.shadcn.com/placeholder.svg"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
