import { useNavigate } from "react-router-dom";

export async function getProcessamentos() {
  const res = await fetch("http://localhost:8000/fenomeno/", {
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
