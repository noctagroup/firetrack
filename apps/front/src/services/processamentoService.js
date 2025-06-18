import { useNavigate } from "react-router-dom";

export async function getProcessamentos() {
  const res = await fetch("https://api.firetrack.nocta-software-dsm.com/fenomeno/", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao buscar processamentos");
  return await res.json();
}

export async function nextSelectProduct(selected_product) {
  // Save the product -> then
  const navigate = useNavigate()

  navigate("/seleciona-periodo")
}
