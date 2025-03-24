import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronsUpDown, LogOut, PanelLeft, Waves } from "lucide-react"
import React from "react"
import { Fragment } from "react/jsx-runtime"
import { Link, Outlet, type UIMatch, useMatches, useNavigate } from "react-router"

import { contaKeys, contaMutations, contaOptions } from "~conta/queries"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~shared/lib/shadcn/ui/dropdown-menu"
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
import { Skeleton } from "~shared/lib/shadcn/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "~shared/lib/shadcn/ui/tooltip"
import { cn } from "~shared/lib/shadcn/utils"

export function FenomenoSidebar() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const sairMutation = useMutation({
    ...contaMutations.sair(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: contaKeys.conta() })
      navigate("/")
    },
  })

  const handleSair = () => {
    sairMutation.mutate()
  }

  return (
    <Sidebar id={SIDEBAR_ID} collapsible="icon">
      <SidebarHeader className="relative m-2 h-8 flex-row items-center p-0">
        <Link to="/">
          <Waves className="bg-muted size-8" />
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
                  <FenomenoSidebarContaInfo />
                  <ChevronsUpDown className="size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" align="start" className="min-w-60">
                <DropdownMenuLabel className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <FenomenoSidebarContaInfo />
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleSair}>
                    <LogOut />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function FenomenoSidebarContaInfo() {
  const contaQuery = useQuery(contaOptions.conta())

  if (!contaQuery.data) {
    return (
      <div className="flex h-full w-full gap-2">
        <Skeleton className="aspect-square size-8 rounded" />

        <Skeleton className="flex-1 rounded" />
      </div>
    )
  }

  return (
    <React.Fragment>
      <Avatar className="size-8">
        <AvatarFallback>{initials(contaQuery.data)}</AvatarFallback>
      </Avatar>

      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">
          {contaQuery.data.full_name || contaQuery.data.username}
        </span>

        <span className="truncate text-xs">{contaQuery.data.email}</span>
      </div>
    </React.Fragment>
  )
}

function FenomenoSidebarToggle({
  hideOn,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hideOn: SidebarContextProps["state"] }) {
  const sidebar = useSidebar()

  return (
    <div
      {...props}
      className={cn(
        "visible opacity-100 transition-all duration-75",
        {
          "invisible opacity-0":
            (hideOn === "collapsed" && sidebar.state === "collapsed") ||
            (hideOn === "expanded" && sidebar.state === "expanded"),
        },
        props.className
      )}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={sidebar.toggleSidebar} className="size-8" size="icon" variant="ghost">
            <PanelLeft className="size-5" />
          </Button>
        </TooltipTrigger>

        <TooltipContent side="right" align="center">
          Alternar painel lateral
        </TooltipContent>
      </Tooltip>
    </div>
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
