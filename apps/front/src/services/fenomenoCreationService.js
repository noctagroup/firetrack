import { useLoading } from "../store/LoadingContext";

export async function handleProdutoSelection(fenomenoId, selectedProduct) {
    const body = {
        "product_id": selectedProduct
    }
}

export async function handlePeriodSelection(fenomenoId, startDatetime, endDatetime) {
    const body = {
        "start_datetime": startDatetime,
        "end_datetime": endDatetime
    }
}