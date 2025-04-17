import { FenomenoInset, FenomenoSidebar } from "~fenomeno/routes/_fenomeno/components"
import { useStorage } from "~shared/hooks/use-storage"
import { LocalStorage } from "~shared/hooks/use-storage/storage/local"
import { SidebarProvider } from "~shared/lib/shadcn/ui/sidebar"

// TODO: tornar global
const localStorage = new LocalStorage<boolean>()

export default function Fenomeno() {
  const [sidebar, setSidebar] = useStorage("sidebar", true, localStorage)

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
