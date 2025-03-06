import os

from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import FileResponse

app = FastAPI(openapi_url=None, docs_url=None, redoc_url=None)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(BASE_DIR, "openapi.yaml")


@app.get("/openapi.yaml", include_in_schema=False)
async def openapi_yaml():
    """
    Serve o arquivo openapi.yaml como resposta HTTP.
    """
    if not os.path.exists(FILE_PATH):
        return {"error": "Arquivo não encontrado"}

    return FileResponse(FILE_PATH, media_type="application/x-yaml")


@app.get("/docs", include_in_schema=False)
async def swagger_ui():
    return get_swagger_ui_html(openapi_url="/openapi", title="Firetracker")
