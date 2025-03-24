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
