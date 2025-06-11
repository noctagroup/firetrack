import { CircleOff } from "lucide-react"
import { Button } from "~shared/lib/shadcn/ui/button"

export default function DeteccaoIndex() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <CircleOff className="mx-auto" size={48} />
        <h1 className="text-3xl leading-none font-semibold">Nenhuma detecção criada</h1>
        <h2 className="text-muted-foreground text-md">
          Para detectar cicatrizes de queimadas crie uma nova detecção
        </h2>

        <div className="flex justify-center">
          <Button className="w-40">Criar detecção</Button>
        </div>
      </div>
    </div>
  )
}
