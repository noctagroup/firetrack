import { httpClient } from "./clients/http"

async function listProcessamentos() {
  const response = await httpClient.get("/queimadas/")

  return response
}

export const QueimadasServices = {
  listProcessamentos,
}
