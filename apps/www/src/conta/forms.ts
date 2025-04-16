import * as v from "valibot"

export const EntrarForm = v.object({
  query: v.pipe(
    v.string("Insira um email ou nome de usuário"),
    v.nonEmpty("Insira um email ou nome de usuário"),
    v.trim()
  ),
  password: v.pipe(v.string("Insira sua senha"), v.nonEmpty("Insira sua senha"), v.trim()),
})

export type TEntrarForm = v.InferInput<typeof EntrarForm>

export const CadastrarForm = v.object({
  username: v.pipe(
    v.string("Insira um nome de usuáro"),
    v.nonEmpty("Insira um nome de usuário"),
    v.trim()
  ),
  first_name: v.pipe(v.string("Insira seu nome"), v.nonEmpty("Insira seu nome"), v.trim()),
  last_name: v.pipe(v.string("Insira seu sobrenome"), v.nonEmpty("Insira seu sobrenome"), v.trim()),
  email: v.pipe(v.string("Insira um email"), v.nonEmpty("Insira um email"), v.trim()),
  password: v.pipe(v.string("Insira sua senha"), v.nonEmpty("Insira sua senha"), v.trim()),
})

export type TCadastrarForm = v.InferInput<typeof CadastrarForm>
