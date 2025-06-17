from typing import List

from django.core.exceptions import PermissionDenied

from firetrack.core.exceptions import ProductNotFoundError
import firetrack.stac.services as StacService
from firetrack.produtos.models import Produto


def list_registered_products() -> List[Produto]:
    return Produto.objects.all()


def list_all_products() -> List[dict]:
    return StacService.list_all_products()


def register_product(
    product_id: str,
    regrowth_threshold: int,
) -> tuple[Produto, bool]:
    if Produto.objects.filter(product_id=product_id).exists():
        raise PermissionDenied("Produto já registrado.")

    product_dict = StacService.get_product_by_id(product_id)

    return Produto.objects.update_or_create(
        product_id=product_dict["id"],
        description=product_dict["description"],
        regrowth_threshold=regrowth_threshold,
    )


def get_product_threshold(product_id: int) -> int:
    try:
        product = Produto.objects.get(product_id=product_id)
        return product.regrowth_threshold
    except Produto.DoesNotExist:
        raise ProductNotFoundError("Produto não encontrado.")
