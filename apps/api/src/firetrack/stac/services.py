import json
from typing import List

import pystac_client

import firetrack.stac.serializers as Serializers
from firetrack.core.exceptions import ProductNotFoundError


def list_all_products() -> List[dict]:
    service = pystac_client.Client.open("https://data.inpe.br/bdc/stac/v1/")
    collections = service.get_collections()
    products = []

    for collection in collections:
        products.append(Serializers.serialize_collection_to_dict(collection))

    return products


def get_product_by_id(product_id: str) -> dict:
    service = pystac_client.Client.open("https://data.inpe.br/bdc/stac/v1/")
    collections = service.get_collections()

    for collection in collections:
        if collection.id.lower() == product_id.lower():
            return Serializers.serialize_collection_to_dict(collection)

    raise ProductNotFoundError(product_id)


if __name__ == "__main__":
    products = list_all_products()
    for product in products[0:4]:
        print(json.dumps(product, indent=2))

    print("teste")
    # Obter detalhes de um produto específico
    product_details = get_product_by_id("MODIS/006/MOD14A1")
    print(product_details)
