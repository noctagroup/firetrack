from pydantic import PostgresDsn
from starlette.config import Config

config: Config = Config(env_file=".env", env_prefix="FASTAPI_")

POSTGRES_DB: str = config("POSTGRES_DB")
POSTGRES_USER: str = config("POSTGRES_USER")
POSTGRES_PASSWORD: str = config("POSTGRES_PASSWORD")
POSTGRES_HOST: str = config("POSTGRES_HOST")
POSTGRES_PORT: int = config("POSTGRES_PORT", cast=int)

POSTGRES_URL: str = str(
    PostgresDsn.build(
        scheme="postgresql+asyncpg",
        host=POSTGRES_HOST,
        password=POSTGRES_PASSWORD,
        username=POSTGRES_USER,
        port=POSTGRES_PORT,
    )
)
