import * as v from "valibot"

import { isObject } from "~shared/utils"

export const EntrarForm = v.object({
  query: v.pipe(
    v.string("Insira um email ou nome de usuário"),
    v.nonEmpty("Insira um email ou nome de usuário"),
    v.trim()
  ),
  password: v.pipe(v.string("Insira sua senha"), v.nonEmpty("Insira sua senha"), v.trim()),
})

export type TEntrarForm = v.InferInput<typeof EntrarForm>

export const CadastrarForm = v.pipe(
  v.object({
    username: v.pipe(
      v.string("Insira um nome de usuáro"),
      v.nonEmpty("Insira um nome de usuário"),
      v.trim()
    ),
    first_name: v.pipe(v.string("Insira seu nome"), v.nonEmpty("Insira seu nome"), v.trim()),
    last_name: v.pipe(
      v.string("Insira seu sobrenome"),
      v.nonEmpty("Insira seu sobrenome"),
      v.trim()
    ),
    email: v.pipe(
      v.string("Insira um email"),
      v.nonEmpty("Insira um email"),
      v.trim(),
      v.email("Insira um email válido")
    ),
    password: v.pipe(v.string("Insira uma senha"), v.nonEmpty("Insira uma senha"), v.trim()),
    password_confirmation: v.pipe(
      v.string("Confirme sua senha"),
      v.nonEmpty("Confirme sua senha"),
      v.trim()
    ),
  }),
  v.custom((values) => {
    if (isObject(values) && "password" in values && "password_confirmation" in values) {
      return values.password === values.password_confirmation
    }

    return false
  }, "As senhas não coincidem")
)

export type TCadastrarForm = v.InferInput<typeof CadastrarForm>
