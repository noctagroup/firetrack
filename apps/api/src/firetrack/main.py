from fastapi import FastAPI
from sqlalchemy import Column, Integer

from firetrack.database.core import async_engine
from firetrack.database.dependencies import AsyncSessionDep
from firetrack.database.model import Model


class User(Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)


async def lifespan(app: FastAPI):
    # TODO: FIXME: isso aqui é uma gambiarra, as migrações deveriam ser controladas pelo alembic
    async with async_engine.begin() as conn:
        try:
            await conn.run_sync(Model.metadata.create_all)
            yield
        except Exception:
            await conn.rollback()


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root(db: AsyncSessionDep):
    return {
        "hello": "world",
    }
