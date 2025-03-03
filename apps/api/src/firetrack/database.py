from contextlib import asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.ext.asyncio.engine import AsyncEngine
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import DeclarativeBase

from firetrack.config import POSTGRES_URL

engine: AsyncEngine = create_async_engine(
    POSTGRES_URL,
    echo=True,
)

session_maker: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


@asynccontextmanager
async def get_session() -> AsyncGenerator[AsyncSession]:
    async with session_maker() as session:
        try:
            yield session
        finally:
            await session.close()


class Model(DeclarativeBase):
    pass
