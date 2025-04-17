import { FenomenoInset, FenomenoSidebar } from "~fenomeno/routes/_fenomeno/components"
import { LocalStorage, useStorage } from "~shared/hooks/use-storage"
import { SidebarProvider } from "~shared/lib/shadcn/ui/sidebar"

// TODO: tornar global
const localStorage = new LocalStorage<boolean>()

export default function Fenomeno() {
  const [sidebar, setSidebar] = useStorage<boolean>("sidebar", true, localStorage)

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
