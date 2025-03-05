from typing import Sequence

from geoalchemy2.shape import from_shape
from shapely import box
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from firetrack.config import SRID
from firetrack.queimadas.models import CicatrizQueimadas
from firetrack.queimadas.schemas import CicatrizQueimadasInSchema


async def list_cicatriz_queimadas(session: AsyncSession) -> Sequence[CicatrizQueimadas]:
    statement = select(CicatrizQueimadas).order_by(CicatrizQueimadas.created_at.desc())
    result = await session.execute(statement)

    return result.scalars().all()


async def create_cicatriz_queimadas(
    session: AsyncSession,
    cicatriz_queimadas_in: CicatrizQueimadasInSchema,
) -> CicatrizQueimadas:
    cicatriz = CicatrizQueimadas()

    cicatriz.bbox = from_shape(
        box(*cicatriz_queimadas_in.bbox),
        srid=SRID,
    )

    session.add(cicatriz)

    await session.commit()
    await session.refresh(cicatriz)

    return cicatriz
