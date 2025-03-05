from datetime import datetime
from typing import Any, Optional

from geoalchemy2 import WKBElement
from geoalchemy2.shape import to_shape
from pydantic import BaseModel, ConfigDict, field_serializer, model_validator

from firetrack.queimadas.enums import CicatrizQueimadasStatus

type BBox = tuple[float, float, float, float]


class CicatrizQueimadasSchema(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: int
    bbox: WKBElement
    created_at: datetime
    updated_at: datetime
    periodo_start_at: datetime
    periodo_end_at: datetime
    status: CicatrizQueimadasStatus

    @field_serializer("bbox")
    def serialize_bbox(self, bbox: WKBElement) -> BBox:
        return to_shape(bbox).bounds


class CicatrizQueimadasThumbnailAssetSchema(BaseModel):
    href: str
    media_type: str


class CicatrizQueimadasThumbnailSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    collection_id: str
    bbox: BBox
    datetime: datetime
    assets: dict[str, CicatrizQueimadasThumbnailAssetSchema]
    thumbnail: Optional[CicatrizQueimadasThumbnailAssetSchema] = None

    @model_validator(mode="before")
    @classmethod
    def separe_thumbnail_assets(cls, data: Any):
        if "thumbnail" in data.assets:
            data.thumbnail = data.assets.pop("thumbnail")

        return data


class CicatrizQueimadasInSchema(BaseModel):
    bbox: BBox
    periodo_start_at: datetime
    periodo_end_at: datetime
