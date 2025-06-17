import json
import logging
from typing import List

import pystac_client
import firetrack.stac.serializers as Serializers
from firetrack.core.exceptions import NoCandidatesError, ProductNotFoundError

logger = logging.getLogger(__name__)


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

    logger.debug(
        "Starting search for product: {product_id}, bbox: {bbox}, "
        "start_date: {start_date}, end_date: {end_date}".format(
            product_id=product_id, bbox=bbox, start_date=start_date, end_date=end_date
        )
    )
    search = service.search(
        collections=[product_id],
        bbox=bbox,
        datetime=f"{start_date}/{end_date}",
    )

    items = search.items()

    if not items:
        raise NoCandidatesError(product_id)

    serialized_items = [Serializers.serialize_item_to_dict(item) for item in items]

    logger.debug(f"Found {len(serialized_items)} items for product {product_id}")

    return serialized_items


if __name__ == "__main__":

    a = query_product_by_bbox_and_period(
        "CB4-WFI-L2-DN-1",
        [-54.404297, -25.562265, -42.890625, -18.687879],
        "2025-03-04T00:00:00Z",
        "2025-05-11T23:59:59Z",
    )

    print(len(a))

    print(
        json.dumps(
            query_product_by_bbox_and_period(
                "CB4-WFI-L2-DN-1",
                [-54.404297, -25.562265, -42.890625, -18.687879],
                "2025-03-04T00:00:00Z",
                "2025-05-11T23:59:59Z",
            ),
            indent=2,
        )
    )
