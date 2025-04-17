import { FenomenoInset, FenomenoSidebar } from "~fenomeno/routes/_fenomeno/components"
import { useLocalStorage } from "~shared/hooks/use-local-storage"
import { SidebarProvider } from "~shared/lib/shadcn/ui/sidebar"

export default function Fenomeno() {
  const [sidebar, setSidebar] = useLocalStorage<boolean>("sidebar", true)

  return (
    <SidebarProvider defaultOpen={sidebar} open={sidebar} onOpenChange={setSidebar}>
      <FenomenoSidebar />
      <FenomenoInset />
    </SidebarProvider>
  )
}

export const handle = {
  breadcrumb: "Fenômenos",
}
