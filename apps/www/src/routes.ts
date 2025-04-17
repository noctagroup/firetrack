import { type RouteConfigEntry } from "@react-router/dev/routes"
import { flatRoutes } from "@react-router/fs-routes"

const routes = (await Promise.all([
  flatRoutes({
    rootDirectory: "./shared/routes",
  }),
  flatRoutes({
    rootDirectory: "./conta/routes",
  }),
  flatRoutes({
    rootDirectory: "./fenomeno/routes",
  }),
])) satisfies RouteConfigEntry[][]

export default routes.flat() satisfies RouteConfigEntry[]
