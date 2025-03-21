import { useQuery } from "@tanstack/react-query"
import { PanelLeft, Waves } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import { Link, Outlet, type UIMatch, useMatches } from "react-router"

import { contaOptions } from "~conta/queries"
import { SIDEBAR_ID } from "~fenomeno/constants"
import { initials } from "~fenomeno/routes/_fenomeno/utils"
import { Avatar, AvatarFallback } from "~shared/lib/shadcn/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~shared/lib/shadcn/ui/breadcrumb"
import { Button } from "~shared/lib/shadcn/ui/button"
import { DropdownMenu, DropdownMenuTrigger } from "~shared/lib/shadcn/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  type SidebarContextProps,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "~shared/lib/shadcn/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "~shared/lib/shadcn/ui/tooltip"
import { cn } from "~shared/lib/shadcn/utils"

export function FenomenoSidebar() {
  const minhaConta = useQuery(contaOptions.minhaConta())

  return (
    <Sidebar id={SIDEBAR_ID} collapsible="icon">
      <SidebarHeader className="relative m-2 h-8 flex-row items-center p-0">
        <Link to="/">
          <Waves className="bg-muted aspect-square size-8" />
        </Link>

        <FenomenoSidebarToggle className="absolute right-0" hideOn="collapsed" />
      </SidebarHeader>

      <SidebarContent />

      <SidebarFooter>
        <FenomenoSidebarToggle hideOn="expanded" />

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="aspect-square size-8 rounded">
                    <AvatarFallback className="rounded font-semibold">
                      {initials(minhaConta.data!)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {minhaConta.data!.full_name || minhaConta.data!.username}
                    </span>

                    <span className="truncate text-xs">{minhaConta.data!.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function FenomenoSidebarToggle({
  hideOn,
  ...props
}: React.ComponentProps<typeof Button> & { hideOn: SidebarContextProps["state"] }) {
  const sidebar = useSidebar()

  const baseHideOnClass = "opacity-100 transition-opacity duration-1000"
  const hideOnClass =
    hideOn === "collapsed"
      ? "group-data-[state=collapsed]:hidden group-data-[state=collapsed]:opacity-0"
      : "group-data-[state=expanded]:hidden group-data-[state=expanded]:opacity-0"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...props}
          onClick={sidebar.toggleSidebar}
          className={cn("size-8", baseHideOnClass, hideOnClass, props.className)}
          size="icon"
          variant="ghost">
          <PanelLeft className="size-5" />
        </Button>
      </TooltipTrigger>

      <TooltipContent
        className={cn(baseHideOnClass, hideOnClass, "transition-none duration-0")}
        side="right"
        align="center">
        Alternar painel lateral
      </TooltipContent>
    </Tooltip>
  )
}

export function FenomenoInset() {
  const matches = useMatches() as UIMatch<unknown, { breadcrumb?: string }>[]

  return (
    <SidebarInset>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
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

      <div className="shrink-0 grow-1 basis-auto">
        <Outlet />
      </div>
    </SidebarInset>
  )
}
