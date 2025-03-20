import { parse } from "valibot"

import type { TContaSchema } from "~conta/schemas"
import { ContaSchema } from "~conta/schemas"
import { httpClient } from "~shared/clients/http"

async function getConta(): Promise<TContaSchema> {
  const response = await httpClient.get("/conta/")
  const conta = parse(ContaSchema, response.data)

  return conta
}

export const ContaServices = {
  getConta,
}
