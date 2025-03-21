import { FenomenoInset, FenomenoSidebar } from "~fenomeno/routes/_fenomeno/components"
import { useLocalStorage } from "~shared/hooks/use-local-storage"
import { SidebarProvider } from "~shared/lib/shadcn/ui/sidebar"

export default function Fenomeno() {
  const [sidebarOpen, setSidebarOpen] = useLocalStorage("sidebar-open", true)

  return (
    <SidebarProvider defaultOpen={sidebarOpen} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <FenomenoSidebar />
      <FenomenoInset />
    </SidebarProvider>
  )
}

export const handle = {
  breadcrumb: "Fenômenos",
}
