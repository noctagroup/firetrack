import { valibotResolver } from "@hookform/resolvers/valibot"
import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { LoaderCircle } from "lucide-react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { Link, type NavigateFunction, useNavigate } from "react-router"
import { safeParse } from "valibot"

import { CadastrarForm, type TCadastrarForm } from "~conta/forms"
import { contaKeys, contaMutations } from "~conta/queries"
import type { TContaSchema } from "~conta/schemas"
import { Button } from "~shared/lib/shadcn/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~shared/lib/shadcn/ui/form"
import { Input } from "~shared/lib/shadcn/ui/input"
import { DetailedErrorListSchema } from "~shared/schemas"

export default function ContaCadastrar() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const form = useForm<TCadastrarForm>({
    resolver: valibotResolver(CadastrarForm),
    reValidateMode: "onSubmit",
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  })
  const cadastrarMutation = useMutation({
    ...contaMutations.cadastrar(),
    onSuccess: (data) => handleFormSuccess(data, queryClient, navigate),
    onError: (error) => handleFormError(error, form),
  })

  const handleSubmit = async (values: TCadastrarForm) => await cadastrarMutation.mutateAsync(values)

  return (
    <Form {...form}>
      <form className="space-y-10" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-2">
          <h1 className="text-2xl leading-none font-semibold">Crie sua conta</h1>
          <h2 className="text-muted-foreground text-md text-balance">
            Crie sua conta para começar a utilizar
          </h2>
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={(props) => (
              <FormItem>
                <FormLabel>Nome de usuário</FormLabel>
                <FormControl>
                  <Input {...props.field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={(props) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...props.field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 items-start gap-x-6 gap-y-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="first_name"
              render={(props) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...props.field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={(props) => (
                <FormItem>
                  <FormLabel>Sobrenome</FormLabel>
                  <FormControl>
                    <Input {...props.field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          <FormField
            control={form.control}
            name="password_confirmation"
            render={(props) => (
              <FormItem>
                <FormLabel>Confirme sua senha</FormLabel>
                <FormControl>
                  <Input {...props.field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <Button className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}
            <span>Cadastrar</span>
          </Button>

          <div className="text-center text-sm">
            <span>Já tem uma conta? </span>
            <Link to="../entrar" className="underline underline-offset-4">
              Entrar
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}

function handleFormSuccess(
  data: TContaSchema,
  queryClient: QueryClient,
  navigate: NavigateFunction
) {
  queryClient.setQueryData(contaKeys.conta(), data)
  navigate("/")
}

function handleFormError(error: Error, form: UseFormReturn<TCadastrarForm>) {
  if (!isAxiosError(error)) {
    form.setFocus("username")
    form.setError("username", { message: "Ocorreu um erro desconhecido ao se cadastrar" })

    return undefined
  }

  const result = safeParse(DetailedErrorListSchema, error?.response?.data)

  if (!result.success) {
    form.setFocus("username")
    form.setError("username", { message: "Ocorreu um erro desconhecido ao se cadastrar" })

    return undefined
  }

  const errors = result.output

  for (const error of errors) {
    const location = error.loc[0]

    switch (location) {
      case "email":
        form.setFocus("email")
        form.setError("email", { message: "Este email é inválido" })
        break
      case "password":
        throw Error("Not implemented.")
    }
  }
}
