import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  AlignLeft,
  ChevronsUpDown,
  Computer,
  LogOut,
  type LucideIcon,
  Megaphone,
  Moon,
  PanelLeft,
  Sun,
  Waves,
  X,
} from "lucide-react"
import React from "react"
import {
  Link,
  Outlet,
  resolvePath,
  type UIMatch,
  useLocation,
  useMatches,
  useNavigate,
} from "react-router"

import { contaKeys, contaMutations, contaOptions } from "~conta/queries"
import { SIDEBAR_ID } from "~fenomeno/constants"
import { initials } from "~fenomeno/routes/_fenomeno/utils"
import { Theme, useTheme } from "~shared/hooks/use-theme"
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~shared/lib/shadcn/ui/dropdown-menu"
import { Separator } from "~shared/lib/shadcn/ui/separator"
import {
  Sidebar,
  SidebarContent,
  type SidebarContextProps,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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

const navLinks = [
  {
    icon: Megaphone,
    title: "Fenômenos",
    tooltip: "Fenômenos",
    to: "..",
  },
] as const satisfies {
  icon: LucideIcon
  title: string
  tooltip: string
  to: string
}[]

const themes = [
  {
    icon: Computer,
    title: "Sistema",
    value: Theme.System,
  },
  {
    icon: Sun,
    title: "Claro",
    value: Theme.Light,
  },
  {
    icon: Moon,
    title: "Escuro",
    value: Theme.Dark,
  },
] as const satisfies { icon: LucideIcon; value: string; title: string }[]

export function FenomenoSidebar() {
  const location = useLocation()
  const sidebar = useSidebar()
  const themeContext = useTheme()
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
      <SidebarHeader className="relative h-12 flex-row items-center border-b p-2">
        <Link to="/">
          <Waves className="size-8" />
        </Link>

        {sidebar.isMobile ? (
          <Button
            onClick={sidebar.toggleSidebar}
            className="absolute right-0 mr-2 size-6"
            size="icon"
            variant="link">
            <X className="size-5" />
          </Button>
        ) : (
          <FenomenoSidebarToggle className="absolute right-0 mr-2" hideOn="collapsed" />
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((navLink, navLinkIndex) => {
                const resolvedPath = resolvePath(navLink.to)

                return (
                  <SidebarMenuItem key={navLinkIndex}>
                    <SidebarMenuButton
                      asChild
                      isActive={resolvedPath.pathname === location.pathname}
                      tooltip={navLink.tooltip}>
                      <Link to={navLink.to}>
                        <navLink.icon />
                        {navLink.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        {!sidebar.isMobile && <FenomenoSidebarToggle hideOn="expanded" />}

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="gap-3">
                  <FenomenoSidebarContaInfo />
                  <ChevronsUpDown className="size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" align="start" className="min-w-60">
                <DropdownMenuLabel className="flex items-center gap-3 px-1 py-1.5 text-left text-sm">
                  <FenomenoSidebarContaInfo />
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Tema</DropdownMenuLabel>

                <DropdownMenuRadioGroup
                  value={themeContext.theme}
                  onValueChange={themeContext.setTheme as (value: string) => void}>
                  {themes.map((theme) => (
                    <DropdownMenuRadioItem key={theme.value} value={theme.value}>
                      <theme.icon />
                      {theme.title}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleSair}>
                    <LogOut />
                    Sair
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

  if (contaQuery.isLoading || !contaQuery.data) {
    return (
      <div className="flex h-full w-full gap-3">
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
  className,
  hideOn,
  ...props
}: React.ComponentProps<"button"> & { hideOn: SidebarContextProps["state"] }) {
  const sidebar = useSidebar()
  const isHidden = sidebar.state === hideOn

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-hidden={isHidden}
          onClick={sidebar.toggleSidebar}
          className={cn(
            "size-8 transition transition-discrete duration-150 data-[hidden=true]:hidden data-[hidden=true]:opacity-0 starting:opacity-0",
            className
          )}
          size="icon"
          variant="ghost"
          {...props}>
          <PanelLeft className="size-5" />
        </Button>
      </TooltipTrigger>

      <TooltipContent side="right" align="center">
        Alternar painel lateral
      </TooltipContent>
    </Tooltip>
  )
}

export function FenomenoInset() {
  const sidebar = useSidebar()
  const matches = useMatches() as UIMatch<unknown, { breadcrumb?: string }>[]

  return (
    <SidebarInset>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        {sidebar.isMobile && (
          <>
            <Button onClick={sidebar.toggleSidebar} className="size-6" size="icon" variant="link">
              <AlignLeft className="size-5" />
            </Button>
            <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
          </>
        )}

        <Breadcrumb>
          <BreadcrumbList>
            {matches.map((match, matchIndex) => {
              if (!match.handle?.breadcrumb) {
                return undefined
              }

              const breadcrumb = match.handle.breadcrumb
              const lastMatchIndex = matches.length - 1

              return (
                <React.Fragment key={matchIndex}>
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
                </React.Fragment>
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
