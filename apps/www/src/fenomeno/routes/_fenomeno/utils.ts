import type { TContaSchema } from "~conta/schemas"

export function initials(conta: TContaSchema) {
  const str = conta.full_name.trim() || conta.username.trim()

  const split = str.split(" ")

  if (split.length === 1) {
    return str.slice(0, 2).toUpperCase()
  }

  return split
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("")
}
