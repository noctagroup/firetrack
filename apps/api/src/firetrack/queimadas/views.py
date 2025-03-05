from typing import List

from fastapi import APIRouter
from geoalchemy2.shape import to_shape
from shapely import bounds

from firetrack.database.dependencies import AsyncSessionDep
from firetrack.queimadas.schemas import (
    CicatrizQueimadasCreateSchema,
    CicatrizQueimadasSchema,
)
from firetrack.queimadas.services import (
    create_cicatriz_queimadas,
    list_cicatriz_queimadas,
)

router = APIRouter()


@router.get("/", response_model=List[CicatrizQueimadasSchema])
async def list(session: AsyncSessionDep):
    cicatriz_queimadas = await list_cicatriz_queimadas(session)

    return cicatriz_queimadas


@router.post(
    "/",
    response_model=CicatrizQueimadasSchema,
)
async def create(
    session: AsyncSessionDep,
    cicatriz_queimadas_in: CicatrizQueimadasCreateSchema,
):
    cicatriz_queimadas = await create_cicatriz_queimadas(session, cicatriz_queimadas_in)

    print(bounds(to_shape(cicatriz_queimadas.bbox)).tolist())

    return cicatriz_queimadas
