import * as v from "valibot"

export const DetailedErrorSchema = v.object({
  type: v.string(),
  loc: v.array(v.union([v.string(), v.pipe(v.number(), v.integer())])),
  msg: v.string(),
  input: v.any(),
  ctx: v.optional(v.record(v.string(), v.any())),
})

export type TDetailedErrorSchema = v.InferInput<typeof DetailedErrorSchema>

export const DetailedErrorListSchema = v.array(DetailedErrorSchema)

export type TDetailedErrorListSchema = v.InferInput<typeof DetailedErrorListSchema>
