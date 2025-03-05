from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from firetrack.config import POSTGRES_URL

async_engine: AsyncEngine = create_async_engine(POSTGRES_URL)
async_session: async_sessionmaker[AsyncSession] = async_sessionmaker(bind=async_engine)


async def get_async_session() -> AsyncGenerator[AsyncSession]:
    async with async_session() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
