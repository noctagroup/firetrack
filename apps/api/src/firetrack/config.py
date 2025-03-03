from pydantic import PostgresDsn
from starlette.config import Config

config: Config = Config(env_file=".env", env_prefix="FASTAPI_")

POSTGRES_DB: str = config("POSTGRES_DB", default="postgres")
POSTGRES_USER: str = config("POSTGRES_USER", default="postgres")
POSTGRES_PASSWORD: str = config("POSTGRES_PASSWORD", default="postgres")
POSTGRES_HOST: str = config("POSTGRES_HOST", default="localhost")
POSTGRES_PORT: int = config("POSTGRES_PORT", default=5432, cast=int)

POSTGRES_URL: str = str(
    PostgresDsn.build(
        scheme="postgresql+asyncpg",
        username=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT,
        path=POSTGRES_DB,
    )
)
