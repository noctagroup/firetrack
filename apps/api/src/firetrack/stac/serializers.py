def serialize_collection_to_dict(collection):
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
