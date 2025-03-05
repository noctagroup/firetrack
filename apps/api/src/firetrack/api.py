from fastapi import APIRouter

from firetrack.queimadas.views import router as queimadas_router

api = APIRouter()

api.include_router(queimadas_router, prefix="/queimadas")
