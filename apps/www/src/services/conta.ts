import { httpClient } from "./clients/http"

async function getConta() {
  const response = await httpClient.get("/conta/")

  return response.data
}

export const ContaServices = {
  getConta,
}
