from datetime import datetime

from geoalchemy2 import WKBElement
from geoalchemy2.shape import to_shape
from pydantic import BaseModel, ConfigDict, field_serializer

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


class CicatrizQueimadasInSchema(BaseModel):
    bbox: BBox
    periodo_start_at: datetime
    periodo_end_at: datetime
