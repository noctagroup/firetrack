import { valibotResolver } from "@hookform/resolvers/valibot"
import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { HttpStatusCode, isAxiosError } from "axios"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import { useState } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { Link, type NavigateFunction, useNavigate } from "react-router"
import { safeParse, type SafeParseResult } from "valibot"

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
import { Input, InputAdornment, InputProvider } from "~shared/lib/shadcn/ui/input"
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
    },
  })
  const cadastrarMutation = useMutation({
    ...contaMutations.cadastrar(),
    onSuccess: (data) => handleFormSuccess(data, queryClient, navigate),
    onError: (error) => handleFormError(error, form),
  })
  // NOTA: a atualização desse useState atualiza o componente inteiro, isso é um desperdício.
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true)

  const togglePasswordHidden = () => setPasswordHidden((value) => !value)
  const handleSubmit = async (values: TCadastrarForm) => await cadastrarMutation.mutateAsync(values)

  return (
    <Form {...form}>
      <form className="space-y-10" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-2 text-center md:text-left">
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
                  <InputProvider>
                    <Input {...props.field} />
                  </InputProvider>
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
              name="last_name"
              render={(props) => (
                <FormItem>
                  <FormLabel>Sobrenome</FormLabel>
                  <FormControl>
                    <InputProvider>
                      <Input {...props.field} />
                    </InputProvider>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={(props) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
            // TODO: melhorar a ux de exibição de erros pra esse componente, já que a senha pode ter mais de 1 erro diferente simultaneamente.
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
  queryClient.setQueryData(contaKeys.atual(), data)
  navigate("/fenomeno")
}

function handleFormError(error: Error, form: UseFormReturn<TCadastrarForm>) {
  if (!isAxiosError(error)) {
    form.setError(
      "username",
      { message: "Ocorreu um erro desconhecido ao se cadastrar" },
      { shouldFocus: true }
    )

    return undefined
  }

  let errorSchemaParseResult: SafeParseResult<typeof DetailedErrorListSchema>

  switch (error.status) {
    case HttpStatusCode.Conflict:
      form.setError(
        "username",
        { message: "Já existe outro usuário com este mesmo nome" },
        { shouldFocus: true }
      )
      break
    case HttpStatusCode.BadRequest:
      errorSchemaParseResult = safeParse(DetailedErrorListSchema, error?.response?.data)

      if (!errorSchemaParseResult.success) {
        form.setError(
          "username",
          { message: "Ocorreu um erro desconhecido ao se cadastrar" },
          { shouldFocus: true }
        )
        return undefined
      }

      for (const error of errorSchemaParseResult.output) {
        const location = error.loc[0]

        switch (location) {
          case "email":
            form.setError("email", { message: "Este email é inválido" }, { shouldFocus: true })
            break
          case "password":
            form.setError(
              "password",
              { message: PasswordErrorTypeMessage[error.type] },
              { shouldFocus: true }
            )
            break
        }
      }
      break
  }
}

const PasswordErrorTypeMessage: Record<string, string> = {
  password_too_similar: "Esta senha tem muita similaridade com os outros campos",
  password_too_short: "Esta senha é muito curta",
  password_too_common: "Esta senha é muito comum",
  password_entirely_numeric: "A senha não deve ser completamente numérica",
}
