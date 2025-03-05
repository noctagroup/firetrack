from typing import List

from fastapi import APIRouter, HTTPException

from firetrack.database.dependencies import AsyncSessionDep
from firetrack.queimadas.clients import stac_client
from firetrack.queimadas.schemas import (
    CicatrizQueimadasInSchema,
    CicatrizQueimadasSchema,
    CicatrizQueimadasThumbnailSchema,
)
from firetrack.queimadas.services import (
    create_cicatriz_queimadas,
    get_cicatriz_queimadas,
    list_cicatriz_queimadas,
)

router = APIRouter()


@router.get("/", response_model=List[CicatrizQueimadasSchema])
async def list(session: AsyncSessionDep):
    cicatriz_queimadas = await list_cicatriz_queimadas(session)

    return cicatriz_queimadas


@router.post("/", response_model=CicatrizQueimadasSchema)
async def create(
    session: AsyncSessionDep,
    cicatriz_queimadas_in: CicatrizQueimadasInSchema,
):
    cicatriz_queimadas = await create_cicatriz_queimadas(session, cicatriz_queimadas_in)

    return cicatriz_queimadas


@router.get(
    "/{cicatriz_queimadas_id}/stac",
    response_model=List[CicatrizQueimadasThumbnailSchema],
)
async def stac(session: AsyncSessionDep, cicatriz_queimadas_id: int):
    cicatriz_queimadas = await get_cicatriz_queimadas(session, cicatriz_queimadas_id)

    if not cicatriz_queimadas:
        raise HTTPException(
            status_code=404, detail="Cicatriz de queimadas não encontrada"
        )

    cicatriz_queimadas_validated = CicatrizQueimadasSchema.model_validate(
        cicatriz_queimadas.__dict__,
    )
    cicatriz_queimadas_serialized = CicatrizQueimadasSchema.model_dump(
        cicatriz_queimadas_validated
    )

    search_result = stac_client.search(
        bbox=cicatriz_queimadas_serialized.get("bbox"),
        datetime=(
            cicatriz_queimadas_serialized.get("periodo_start_at"),
            cicatriz_queimadas_serialized.get("periodo_end_at"),
        ),
        collections=["CB4-WFI-L2-DN-1"],
    )

    return search_result.items()
