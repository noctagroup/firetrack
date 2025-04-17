import json
from http import HTTPStatus

from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods, require_POST

import firetrack.fenomeno.services as services


@require_POST
def create_fenomeno(request: WSGIRequest):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    fenomeno = services.create_and_start_fenomeno(request.user)

    return JsonResponse({"id": fenomeno.id, "status": fenomeno.state})


def fenomeno_index(_):
    return JsonResponse({"fenomeno": "fenomeno"})


@require_http_methods(["PATCH"])
def add_aoi_fenomeno(request: WSGIRequest, queimadas_id: str):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    try:
        body = json.loads(request.body)

        fenomeno = services.add_aoi_to_fenomeno(
            fenomeno_id=queimadas_id, aoi_geometry=body
        )

        return JsonResponse({"id": fenomeno.id, "status": fenomeno.state})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=HTTPStatus.BAD_REQUEST)
