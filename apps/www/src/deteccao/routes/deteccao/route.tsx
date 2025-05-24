import { useStorage } from "~shared/hooks/use-storage"
import { localStorage } from "~shared/hooks/use-storage/storage/local"
import { SidebarProvider } from "~shared/lib/shadcn/ui/sidebar"

import { Sidebar, SidebarInset } from "./components"

export default function Deteccao() {
  const [sidebar, setSidebar] = useStorage<boolean>({
    storageKey: "sidebar",
    storageInitialValue: true,
    storage: localStorage,
  })

  return (
    <SidebarProvider defaultOpen={sidebar} open={sidebar} onOpenChange={setSidebar}>
      <Sidebar />
      <SidebarInset />
    </SidebarProvider>
  )
}
