import { Form } from "react-router"

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

export default function Conta() {
  return (
    <div className="relative h-full">
      <div className="conta-gradient-backdrop" />

      <div className="mx-auto max-w-sm px-6 pt-[5%]">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Seja bem-vindo</CardTitle>
            <CardDescription>Para prosseguir, entre ou cadastre-se</CardDescription>
          </CardHeader>

          <CardContent>
            <Form className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email ou nome de usuário</Label>
                <Input id="email" type="email" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" />
              </div>

              <div className="flex flex-col items-center gap-2">
                <Button type="submit" className="w-full">
                  Entrar
                </Button>

                <Button variant="ghost">Criar uma conta</Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
