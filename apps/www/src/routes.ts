import { prefix, type RouteConfigEntry } from "@react-router/dev/routes"
import { flatRoutes } from "@react-router/fs-routes"

type Routes = RouteConfigEntry[]
type RouteConfig = { prefix: string; routes: Routes }[]

const routeConfig: RouteConfig = [
  {
    prefix: "/fenomeno",
    routes: await flatRoutes({
      rootDirectory: "./fenomeno/routes",
    }),
  },
  {
    prefix: "/conta",
    routes: await flatRoutes({
      rootDirectory: "./conta/routes",
    }),
  },
]

const routes: Routes = routeConfig.flatMap((c) => prefix(c.prefix, c.routes))

export default routes
