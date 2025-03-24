import { parse } from "valibot"

import type { TEntrarForm } from "~conta/forms"
import type { TContaSchema } from "~conta/schemas"
import { ContaSchema } from "~conta/schemas"
import { httpClient } from "~shared/clients/http"

async function conta(): Promise<TContaSchema> {
  const response = await httpClient.get("/conta/")
  const conta = parse(ContaSchema, response.data)

  return conta
}

async function sair(): Promise<void> {
  await httpClient.post("/conta/sair/")
}

async function entrar(payload: TEntrarForm): Promise<TContaSchema> {
  const response = await httpClient.post("/conta/entrar/", payload)
  const conta = parse(ContaSchema, response.data)

  return conta
}

export const ContaServices = {
  conta,
  sair,
  entrar,
}
