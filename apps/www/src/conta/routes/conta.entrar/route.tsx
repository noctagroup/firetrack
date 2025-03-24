import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"

import type { TEntrarForm } from "~conta/forms"
import { EntrarForm } from "~conta/forms"
import { contaMutations } from "~conta/queries"
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
  const navigate = useNavigate()
  const form = useForm<TEntrarForm>({
    resolver: valibotResolver(EntrarForm),
    defaultValues: {
      query: "",
      password: "",
    },
  })
  const entrarMutation = useMutation({
    ...contaMutations.entrar(),
    onSuccess: () => {
      navigate("/")
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        switch (error.status) {
          case 404:
            form.setFocus("query")
            form.setError("query", { message: "Usuário não encontrado" })
            break
          case 401:
            form.setFocus("password")
            form.setError("password", { message: "Senha incorreta" })
            break
        }
      } else {
        form.setFocus("query")
        form.setError("query", { message: "Não foi possível entrar" })
      }
    },
  })

  const handleSubmit = async (values: TEntrarForm) => await entrarMutation.mutateAsync(values)

  return (
    <div className="mx-auto max-w-sm p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Seja bem-vindo</CardTitle>
          <CardDescription className="text-muted-foreground text-md text-balance">
            Para prosseguir, entre ou cadastre-se
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
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

              <div className="space-y-4">
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}
                  <span>Entrar</span>
                </Button>

                <div className="text-center text-sm">
                  <span>Não tem uma conta? </span>
                  <Link to="../cadastrar" className="underline underline-offset-4">
                    Cadastre-se
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
