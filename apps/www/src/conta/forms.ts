import * as v from "valibot"

export const EntrarForm = v.object({
  query: v.pipe(v.string(), v.nonEmpty("Insira um email ou nome de usuário")),
  password: v.pipe(v.string(), v.nonEmpty("Por favor, insira sua senha")),
})

export type TEntrarForm = v.InferInput<typeof EntrarForm>
