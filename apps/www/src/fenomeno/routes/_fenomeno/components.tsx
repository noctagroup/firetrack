import { Flame, PanelLeft } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import { Link, Outlet, type UIMatch, useMatches } from "react-router"

import { SIDEBAR_ID } from "~fenomeno/constants"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~shared/lib/shadcn/ui/breadcrumb"
import { Button } from "~shared/lib/shadcn/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarRail,
  useSidebar,
} from "~shared/lib/shadcn/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "~shared/lib/shadcn/ui/tooltip"

export function FenomenoSidebar() {
  return (
    <Sidebar id={SIDEBAR_ID} collapsible="icon">
      <SidebarHeader className="h-12 flex flex-row">
        <Link to="/" className="w-8">
          <Flame className="h-full w-full" />
        </Link>

        <FenomenoSidebarToggle className="group-data-[state=collapsed]:hidden" />
      </SidebarHeader>

      <SidebarContent />

      <SidebarFooter>
        <FenomenoSidebarToggle className="group-data-[state=expanded]:hidden" />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function FenomenoSidebarToggle(props: React.ComponentProps<typeof Button>) {
  const sidebar = useSidebar()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost" onClick={sidebar.toggleSidebar} {...props}>
          <PanelLeft className="size-4" />
        </Button>
      </TooltipTrigger>

      <TooltipContent side="right" align="center">
        Alternar painel lateral
      </TooltipContent>
    </Tooltip>
  )
}

export function FenomenoInset() {
  const matches = useMatches() as UIMatch<unknown, { breadcrumb?: string }>[]

  return (
    <SidebarInset>
      <header className="h-12 px-4 border-b flex gap-2 items-center shrink-0">
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

      <div className="grow-1 shrink-0 basis-auto">
        <Outlet />
      </div>
    </SidebarInset>
  )
}
