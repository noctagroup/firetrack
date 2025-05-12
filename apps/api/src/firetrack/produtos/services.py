from typing import List

from django.core.exceptions import PermissionDenied

import firetrack.stac.services as StacService
from firetrack.produtos.models import Produto


def list_registered_products() -> List[Produto]:
    return Produto.objects.all()


def list_all_products() -> List[dict]:
    return StacService.list_all_products()


def register_product(product_id: str) -> Produto:
    if Produto.objects.filter(product_id=product_id).exists():
        raise PermissionDenied("Produto já registrado.")

    product_dict = StacService.get_product_by_id(product_id)

    return Produto.objects.create(
        product_id=product_dict["id"],
        description=product_dict["description"],
    )
