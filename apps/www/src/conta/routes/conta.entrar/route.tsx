import { valibotResolver } from "@hookform/resolvers/valibot"
import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link } from "react-router"

import type { TEntrarForm } from "~conta/forms"
import { EntrarForm } from "~conta/forms"
import { Button } from "~shared/lib/shadcn/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~shared/lib/shadcn/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~shared/lib/shadcn/ui/form"
import { Input } from "~shared/lib/shadcn/ui/input"

export default function ContaEntrar() {
  const form = useForm<TEntrarForm>({
    resolver: valibotResolver(EntrarForm),
  })

  const handleSubmit = (values: TEntrarForm) => {
    console.log(values)
  }

  return (
    <div className="mx-auto max-w-sm p-4 text-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Seja bem-vindo</CardTitle>
          <CardDescription className="text-muted-foreground text-md text-balance">
            Para prosseguir, entre ou cadastre-se
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="query"
                render={(props) => (
                  <FormItem>
                    <FormLabel>Email ou nome de usuário</FormLabel>
                    <FormControl>
                      <Input {...props.field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={(props) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...props.field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  // disabled={form.formState.isSubmitting || !form.formState.isValid}
                >
                  {form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}
                  <span>Entrar</span>
                </Button>

                <Button className="mx-auto block max-w-4/5" variant="ghost" asChild>
                  <Link to="../cadastrar">Criar uma conta</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
