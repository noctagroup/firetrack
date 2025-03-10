import os
from typing import Annotated

from fastapi import FastAPI, Header
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import FileResponse, RedirectResponse

app = FastAPI(openapi_url=None, docs_url=None, redoc_url=None)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OPENAPI_PATH = os.path.join(BASE_DIR, "openapi.yaml")


@app.get("/openapi.yaml", include_in_schema=False)
async def openapi_yaml():
    return FileResponse(OPENAPI_PATH, media_type="application/x-yaml")


@app.get("/", include_in_schema=False)
async def openapi_ui(user_agent: Annotated[str | None, Header()] = None):
    if user_agent and "Postman" in user_agent:
        return RedirectResponse("/openapi.yaml")

    return get_swagger_ui_html(openapi_url="/openapi.yaml", title="Firetracker")
