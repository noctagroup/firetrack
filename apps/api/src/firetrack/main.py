from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware

from firetrack.api import api
from firetrack.database.core import async_engine
from firetrack.database.models import Model


async def lifespan(_: FastAPI):
    # TODO: FIXME: isso aqui é uma gambiarra, as migrações deveriam ser controladas pelo alembic
    async with async_engine.begin() as conn:
        try:
            await conn.run_sync(Model.metadata.create_all)
            yield
        except Exception:
            await conn.rollback()


app = FastAPI(lifespan=lifespan, default_response_class=ORJSONResponse)


app.add_middleware(GZipMiddleware, minimum_size=512)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api, prefix="/api/v1")
