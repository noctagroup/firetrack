import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { HttpStatusCode, isAxiosError } from "axios"
import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"

import type { TEntrarForm } from "~conta/forms"
import { EntrarForm } from "~conta/forms"
import { contaKeys, contaMutations } from "~conta/queries"
import { Button } from "~shared/lib/shadcn/ui/button"
import { CardDescription, CardTitle } from "~shared/lib/shadcn/ui/card"
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
  const queryClient = useQueryClient()
  const form = useForm<TEntrarForm>({
    resolver: valibotResolver(EntrarForm),
    defaultValues: {
      query: "",
      password: "",
    },
  })
  const entrarMutation = useMutation({
    ...contaMutations.entrar(),
    onSuccess: (data) => {
      queryClient.setQueryData(contaKeys.conta(), data)
      navigate("/")
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        form.setFocus("query")
        form.setError("query", { message: "Não foi possível entrar" })

        return undefined
      }

      switch (error.status) {
        case HttpStatusCode.NotFound:
          form.setFocus("query")
          form.setError("query", { message: "Usuário não encontrado" })
          break
        case HttpStatusCode.Unauthorized:
          form.setFocus("password")
          form.setError("password", { message: "Senha incorreta" })
          break
        default:
          form.setFocus("query")
          form.setError("query", { message: "Usuário ou senha inválidos" })
          break
      }
    },
  })

  const handleSubmit = async (values: TEntrarForm) => await entrarMutation.mutateAsync(values)

  return (
    <Form {...form}>
      <form className="mt-12 space-y-6 md:mt-16" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-bold">Seja bem-vindo</CardTitle>

          <CardDescription className="text-muted-foreground text-md text-balance">
            Para prosseguir, entre ou cadastre-se
          </CardDescription>
        </div>

        <div className="space-y-6">
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
                  <Input {...props.field} type="password" />
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
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
