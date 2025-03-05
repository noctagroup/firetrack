from datetime import datetime

from geoalchemy2 import WKBElement
from geoalchemy2.shape import to_shape
from pydantic import BaseModel, field_serializer
from shapely import bounds

from firetrack.queimadas.enums import ProcessingStates


class CicatrizQueimadasSchema(BaseModel):
    id: int
    bbox: tuple[float, float, float, float]
    created_at: datetime
    updated_at: datetime
    status: ProcessingStates

    @field_serializer("bbox")
    def serialize_bbox(self, bbox: WKBElement) -> tuple[float, float, float, float]:
        val = bounds(to_shape(bbox)).tolist()

        return val


class CicatrizQueimadasCreateSchema(BaseModel):
    bbox: tuple[float, float, float, float]
