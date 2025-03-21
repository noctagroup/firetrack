import { ContaServices } from "~conta/services"

export async function clientAction() {
  await ContaServices.sair()
}
