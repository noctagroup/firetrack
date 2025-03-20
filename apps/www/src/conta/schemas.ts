import * as v from "valibot"

export const ContaSchema = v.object({
  id: v.pipe(v.number(), v.integer()),
  username: v.string(),
  email: v.string(),
  full_name: v.string(),
  last_name: v.string(),
  is_authenticated: v.boolean(),
})

export type TContaSchema = v.InferInput<typeof ContaSchema>
