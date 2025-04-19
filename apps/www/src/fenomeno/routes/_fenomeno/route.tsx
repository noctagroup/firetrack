import { FenomenoSidebar, FenomenoSidebarInset } from "~fenomeno/routes/_fenomeno/components"
import { useStorage } from "~shared/hooks/use-storage"
import { localStorage } from "~shared/hooks/use-storage/storage/local"
import { SidebarProvider } from "~shared/lib/shadcn/ui/sidebar"

export default function Fenomeno() {
  const [sidebar, setSidebar] = useStorage<boolean>("sidebar", true, localStorage)

  return (
    <SidebarProvider defaultOpen={sidebar} open={sidebar} onOpenChange={setSidebar}>
      <FenomenoSidebar />
      <FenomenoSidebarInset />
    </SidebarProvider>
  )
}

export const handle = {
  breadcrumb: "Fenômenos",
}
