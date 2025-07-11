from firetrack.produtos.models import Produto


def serialize_produto(produto: Produto) -> dict:
    return {
        "id": produto.product_id,
        "description": produto.description,
        "regrowth_threshold": produto.regrowth_threshold,
    }
