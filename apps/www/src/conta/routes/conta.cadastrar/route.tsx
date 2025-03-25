import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"

import { CadastrarForm, type TCadastrarForm } from "~conta/forms"
import { contaKeys, contaMutations } from "~conta/queries"
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

export default function ContaCadastrar() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const form = useForm<TCadastrarForm>({
    resolver: valibotResolver(CadastrarForm),
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
    onSuccess: (data) => {
      queryClient.setQueryData(contaKeys.conta(), data)
      navigate("/")
    },
    // TODO: melhorar as mensagens de erro
  })

  const handleSubmit = async (values: TCadastrarForm) => await cadastrarMutation.mutateAsync(values)

  return (
    <Card className="w-md max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Crie sua conta</CardTitle>
        <CardDescription className="text-muted-foreground text-md text-balance">
          Crie sua conta para começar a utilizar
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
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
      </CardContent>
    </Card>
  )
}
