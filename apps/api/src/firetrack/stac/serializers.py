from pystac import Collection, Item


def serialize_collection_to_dict(collection: Collection) -> dict:
    temporal = collection.extent.temporal
    start_date, end_date = None, None
    if temporal and temporal.intervals:
        start_date, end_date = temporal.intervals[0]

    return {
        "id": collection.id,
        "title": collection.title,
        "description": collection.description,
        "start_date": start_date.isoformat() if start_date else None,
        "end_date": end_date.isoformat() if end_date else None,
    }


def serialize_item_to_dict(item: Item) -> dict:
    thumbnail = next(
        (asset.href for asset in item.assets.values() if "thumbnail" in asset.roles),
        None,
    )

    assets = item.assets
    red_band = next(
        (
            asset.href
            for asset in assets.values()
            if "red"
            in asset.extra_fields.get("eo:bands", [{}])[0].get("common_name", "")
        ),
        None,
    )
    nir_band = next(
        (
            asset.href
            for asset in assets.values()
            if "nir"
            in asset.extra_fields.get("eo:bands", [{}])[0].get("common_name", "")
        ),
        None,
    )

    return {
        "id": item.id,
        "datetime": item.properties.get("datetime"),
        "thumbnail": thumbnail,
        "bands": {
            "red": red_band,
            "nir": nir_band,
        },
    }
