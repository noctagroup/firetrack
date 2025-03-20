import type { TContaSchema } from "~/schemas/conta"
import { ContaSchema, parse } from "~/schemas/conta"
import { httpClient } from "~/services/clients/http"

async function getConta(): Promise<TContaSchema> {
  const response = await httpClient.get("/conta/")
  const conta = parse(ContaSchema, response.data)

  return conta
}

export const ContaServices = {
  getConta,
}
