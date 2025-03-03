from fastapi import APIRouter

from firetrack.core.views import router as core_router

api = APIRouter()

api.include_router(core_router, prefix="/core")
