import { getCookie } from "../services/csrf";

export async function handleProdutoSelection(fenomenoId, selectedProduct) {
  const body = {
    product_id: selectedProduct,
  };
  const csrftoken = getCookie("csrftoken");
  return fetch(`http://localhost:8000/fenomeno/${fenomenoId}/produto/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(body),
  });
}

export async function handlePeriodSelection(
  fenomenoId,
  startDatetime,
  endDatetime
) {
  const body = {
    start_datetime: startDatetime,
    end_datetime: endDatetime,
  };
  const csrftoken = getCookie("csrftoken");
  return fetch(`http://localhost:8000/fenomeno/${fenomenoId}/periodo/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(body),
  });
}
