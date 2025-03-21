import { parse } from "valibot"

import type { TContaSchema } from "~conta/schemas"
import { ContaSchema } from "~conta/schemas"
import { httpClient } from "~shared/clients/http"

async function getConta(): Promise<TContaSchema> {
  const response = await httpClient.get("/conta/")
  const conta = parse(ContaSchema, response.data)

  return conta
}

async function sair(): Promise<void> {
  await httpClient.post("/conta/sair/")
}

async function entrar(payload: { query: string; password: string }): Promise<TContaSchema> {
  const response = await httpClient.post("/conta/entrar/", payload)
  const conta = parse(ContaSchema, response.data)

  return conta
}

export const ContaServices = {
  getConta,
  sair,
  entrar,
}
