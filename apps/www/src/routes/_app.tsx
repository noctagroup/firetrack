import { FireExtinguisher } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import type { UIMatch } from "react-router"
import { Link, Outlet, useMatches } from "react-router"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "~/components/ui/sidebar"

export default function App() {
  const matches = useMatches() as UIMatch<unknown, { breadcrumb?: string }>[]

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg">
                <Link to="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <FireExtinguisher className="size-5" />
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent />

        <SidebarFooter />
      </Sidebar>

      <SidebarInset>
        <header className="h-14 px-4 border-b flex gap-2 items-center shrink-0">
          <Breadcrumb>
            <BreadcrumbList>
              {matches.map((match, matchIndex) => {
                if (!match.handle?.breadcrumb) {
                  return undefined
                }

                const breadcrumb = match.handle.breadcrumb
                const lastMatchIndex = matches.length - 1

                return (
                  <Fragment key={matchIndex}>
                    {matchIndex > 1 && <BreadcrumbSeparator className="hidden md:block" />}

                    <BreadcrumbItem>
                      {matchIndex === lastMatchIndex ? (
                        <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild className="hidden md:block">
                          <Link to={match.pathname}>{breadcrumb}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex-1">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export const handle = {
  breadcrumb: "Início",
}
