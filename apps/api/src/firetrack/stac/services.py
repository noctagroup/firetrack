import json
from typing import List

import pystac_client

import firetrack.stac.serializers as Serializers
from firetrack.core.exceptions import NoCandidatesError, ProductNotFoundError


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


def query_product_by_bbox_and_period(
    product_id: str, bbox: List[float], start_date: str, end_date: str
) -> List[dict]:
    service = pystac_client.Client.open("https://data.inpe.br/bdc/stac/v1/")

    search = service.search(
        collections=[product_id],
        bbox=bbox,
        datetime=f"{start_date}/{end_date}",
    )

    items = search.get_items()

    if not items:
        raise NoCandidatesError(product_id)

    return [Serializers.serialize_item_to_dict(item) for item in items]


if __name__ == "__main__":
    print(
        json.dumps(
            query_product_by_bbox_and_period(
                "CB4-WFI-L2-DN-1",
                [-60.0, -10.0, -50.0, 0.0],
                "2023-01-01T00:00:00Z",
                "2023-01-31T23:59:59Z",
            ),
            indent=2,
        )
    )
