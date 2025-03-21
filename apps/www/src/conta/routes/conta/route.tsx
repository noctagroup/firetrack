import { LoaderCircle } from "lucide-react"
import { data, useFetcher } from "react-router"

import { ContaServices } from "~conta/services"
import { Button } from "~shared/lib/shadcn/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~shared/lib/shadcn/ui/card"
import { Input } from "~shared/lib/shadcn/ui/input"
import { Label } from "~shared/lib/shadcn/ui/label"

import type { Route } from "./+types/route"
import stylesheetUrl from "./styles.css?url"

export function links() {
  return [
    {
      href: stylesheetUrl,
      rel: "stylesheet",
    },
  ] satisfies Route.LinkDescriptors
}

export async function clientAction(args: Route.ClientActionArgs) {
  const entrarFormData = await args.request.formData()
  const entrarJson = Object.fromEntries(entrarFormData.entries()) as {
    query: string
    password: string
  }

  try {
    await ContaServices.entrar(entrarJson)
  } catch (error) {
    console.log(error)
    return entrarJson
  }
}

export default function Conta() {
  const fetcher = useFetcher()
  const isSubmitting = fetcher.state === "submitting"

  console.log(fetcher)

  return (
    <div className="relative h-full">
      <div className="conta-gradient-backdrop" />

      <div className="pt-[7%]">
        <div className="mx-auto max-w-sm p-4 text-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Seja bem-vindo</CardTitle>
              <CardDescription className="text-muted-foreground text-md text-balance">
                Para prosseguir, entre ou cadastre-se
              </CardDescription>
            </CardHeader>

            <CardContent>
              <fetcher.Form className="grid gap-8" action="/conta" method="post" noValidate>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={FORM.QUERY}>Email ou nome de usuário</Label>
                    <Input id={FORM.QUERY} name={FORM.QUERY} type="text" required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={FORM.PASSWORD}>Senha</Label>
                    <Input id={FORM.PASSWORD} name={FORM.PASSWORD} type="password" required />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <LoaderCircle className="animate-spin" />}
                    Entrar
                  </Button>

                  <Button variant="ghost">Criar uma conta</Button>
                </div>
              </fetcher.Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const FORM = {
  QUERY: "query",
  PASSWORD: "password",
} as const
