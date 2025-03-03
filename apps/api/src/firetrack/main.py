from fastapi import FastAPI

from firetrack.config import POSTGRES_URL

app = FastAPI()

print(POSTGRES_URL)


@app.get("/")
def hello_world():
    return {
        "hello": "world",
    }
