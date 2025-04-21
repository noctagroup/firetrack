import { valibotResolver } from "@hookform/resolvers/valibot"
import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { HttpStatusCode, isAxiosError } from "axios"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import { useState } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { Link, type NavigateFunction, useNavigate } from "react-router"

import type { TEntrarForm } from "~conta/forms"
import { EntrarForm } from "~conta/forms"
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
import { Input, InputAdornment, InputProvider } from "~shared/lib/shadcn/ui/input"

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
    onSuccess: (data) => handleFormSuccess(data, queryClient, navigate),
    onError: (error) => handleFormError(error, form),
  })

  const [passwordHidden, setPasswordHidden] = useState<boolean>(true)

  const togglePasswordHidden = () => setPasswordHidden((value) => !value)
  const handleSubmit = async (values: TEntrarForm) => await entrarMutation.mutateAsync(values)

  return (
    <Form {...form}>
      <form className="space-y-10" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl leading-none font-semibold">Seja bem-vindo</h1>
          <h2 className="text-muted-foreground text-md text-balance">
            Para prosseguir, entre ou cadastre-se
          </h2>
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="query"
            render={(props) => (
              <FormItem>
                <FormLabel>Email ou nome de usuário</FormLabel>
                <FormControl>
                  <InputProvider>
                    <Input {...props.field} />
                  </InputProvider>
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
                  <InputProvider>
                    <Input {...props.field} type={passwordHidden ? "password" : "text"} />
                    <InputAdornment asChild>
                      <Button
                        className="size-6 rounded-full"
                        size="icon"
                        type="button"
                        variant="ghost"
                        onClick={togglePasswordHidden}>
                        {passwordHidden ? <EyeOff /> : <Eye />}
                      </Button>
                    </InputAdornment>
                  </InputProvider>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
  navigate("/fenomeno")
}

function handleFormError(error: Error, form: UseFormReturn<TEntrarForm>) {
  if (!isAxiosError(error)) {
    form.setError(
      "query",
      { message: "Ocorreu um erro desconhecido ao entrar" },
      { shouldFocus: true }
    )
    return undefined
  }

  switch (error.status) {
    case HttpStatusCode.NotFound:
      form.setError("query", { message: "Usuário não encontrado" }, { shouldFocus: true })
      break
    case HttpStatusCode.Unauthorized:
      form.setError("password", { message: "Senha incorreta" }, { shouldFocus: true })
      break
    default:
      form.setError("query", { message: "Usuário ou senha inválidos" })
      break
  }
}
