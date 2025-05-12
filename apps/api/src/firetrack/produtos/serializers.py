from firetrack.produtos.models import Produto


def serialize_produto(produto: Produto) -> dict:
    return {
        "product_id": produto.product_id,
        "description": produto.description,
    }
