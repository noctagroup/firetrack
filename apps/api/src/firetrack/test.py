from firetrack.services.stac_service import StacService

stac_service = StacService("https://data.inpe.br/bdc/stac/v1/")

filtered_items = stac_service.get_collection_items_filtered(
    bbox=(-61.7960, -9.0374, -61.7033, -8.9390),
    datetime="2024-02-01/2024-02-28",
    collections=["CB4-WFI-L2-DN-1"]
)

print(filtered_items)
