import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ChevronsUpDown,
  Computer,
  LogOut,
  type LucideIcon,
  Megaphone,
  Moon,
  Palette,
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
import { Theme, useTheme } from "~shared/hooks/use-theme"
import { Avatar, AvatarFallback } from "~shared/lib/shadcn/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~shared/lib/shadcn/ui/breadcrumb"
import { Button } from "~shared/lib/shadcn/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~shared/lib/shadcn/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
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
import { isNil } from "~shared/utils/is"

import { initials } from "./utils"

const navLinks = [
  {
    icon: Megaphone,
    title: "Fenômenos",
    tooltip: "Fenômenos",
    to: ".",
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

export function FenomenoSidebarInset() {
  const sidebar = useSidebar()
  const matches = useMatches() as UIMatch<unknown, { breadcrumb?: string }>[]
  const lastMatchWithBreadcrumbIndex = React.useMemo(
    () => matches.findLastIndex((match) => !isNil(match.handle?.breadcrumb)),
    [matches]
  )

  return (
    <SidebarInset>
      <header className="bg-background/60 sticky top-0 flex h-10 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
        <Button onClick={sidebar.toggleSidebar} size="icon" variant="link" className="size-6">
          <PanelLeft className="size-4" strokeWidth={2.0} />
        </Button>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>
                {matches[lastMatchWithBreadcrumbIndex]?.handle?.breadcrumb}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="shrink-0 grow-1 basis-auto">
        <Outlet />
      </div>
    </SidebarInset>
  )
}

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
      navigate("/conta")
    },
  })

  const handleSair = () => {
    sairMutation.mutate()
  }

  return (
    <Sidebar id="fenomeno_sidebar" collapsible="offcanvas" variant="sidebar">
      <SidebarHeader className="relative flex-row items-center p-2">
        <Link to="/">
          <Waves className="size-8" />
        </Link>

        {sidebar.isMobile && (
          <Button
            onClick={sidebar.toggleSidebar}
            className="absolute right-0 mr-2 size-6"
            size="icon"
            variant="link">
            <X className="size-5" />
          </Button>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((navLink, navLinkIndex) => {
                const resolvedPath = resolvePath(navLink.to, location.pathname)

                return (
                  <SidebarMenuItem key={navLinkIndex}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith(resolvedPath.pathname)}
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="gap-3">
                  <ContaDetails />
                  <ChevronsUpDown className="size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" align="start" className="min-w-48">
                <DropdownMenuLabel className="flex items-center gap-3 px-1 py-1.5 text-left text-sm">
                  <ContaDetails />
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Preferências</DropdownMenuLabel>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2">
                    <Palette className="text-muted-foreground size-4" />
                    Tema
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={themeContext.theme}
                        onValueChange={themeContext.setTheme as (value: string) => void}>
                        {themes.map((theme) => (
                          <DropdownMenuRadioItem key={theme.value} value={theme.value}>
                            <theme.icon className="text-muted-foreground size-4" />
                            {theme.title}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

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

function ContaDetails() {
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
        <span className="truncate font-medium">
          {contaQuery.data.full_name || contaQuery.data.username}
        </span>

        <span className="text-muted-foreground truncate text-xs">{contaQuery.data.email}</span>
      </div>
    </React.Fragment>
  )
}
