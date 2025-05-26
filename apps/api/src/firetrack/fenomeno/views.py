import json
from http import HTTPStatus

from django.core.exceptions import PermissionDenied
from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods, require_POST

import firetrack.fenomeno.serializers as serializer
import firetrack.fenomeno.services as services


@require_POST
@csrf_exempt
def create_fenomeno(request: WSGIRequest):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    fenomeno = services.create_and_start_fenomeno(request.user)

    return JsonResponse(serializer.serialize_fenomeno_to_status_and_id(fenomeno))


@require_GET
def get_fenomenos(request: WSGIRequest):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    data = services.list_user_fenomenos(request.user)
    return JsonResponse(serializer.serialize_fenomenos_to_admin_info(data))


@require_http_methods(["PATCH"])
def update_fenomeno_period(request: WSGIRequest, queimadas_id: int):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    try:
        data = json.loads(request.body)
        start_date = data.get("start_datetime")
        end_date = data.get("end_datetime")

        if not start_date or not end_date:
            return JsonResponse(
                {"error": "Ambas as datas são obrigatórias."},
                status=HTTPStatus.BAD_REQUEST,
            )

        fenomeno = services.update_fenomeno_period(
            request.user, queimadas_id, start_date, end_date
        )
        return JsonResponse(serializer.serialize_fenomeno_to_status_and_id(fenomeno))

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido."}, status=HTTPStatus.BAD_REQUEST)
    except services.InvalidDateFormat as e:
        return JsonResponse({"error": str(e)}, status=HTTPStatus.BAD_REQUEST)
    except services.InvalidDateRange as e:
        return JsonResponse({"error": str(e)}, status=HTTPStatus.BAD_REQUEST)
    except PermissionDenied:
        return HttpResponse(status=HTTPStatus.FORBIDDEN)


@require_http_methods(["PATCH"])
def update_fenomeno_aoi(request: WSGIRequest, queimadas_id: int):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    try:
        aoi = json.loads(request.body)
        if not isinstance(aoi, list) or len(aoi) != 4:
            return JsonResponse(
                {
                    "error": "O corpo da requisição deve ser um array com exatamente 4 valores [minX, minY, maxX, maxY]."
                },
                status=HTTPStatus.BAD_REQUEST,
            )
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido."}, status=HTTPStatus.BAD_REQUEST)

    if not aoi:
        return JsonResponse(
            {"error": "Área de interesse (AOI) é obrigatória."},
            status=HTTPStatus.BAD_REQUEST,
        )

    fenomeno = services.update_fenomeno_aoi(request.user, queimadas_id, aoi)
    return JsonResponse(serializer.serialize_fenomeno_to_status_and_id(fenomeno))


@require_http_methods(["PATCH"])
def update_fenomeno_product(request: WSGIRequest, queimadas_id: int):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    try:
        data = json.loads(request.body)
        product = data.get("product_id")
        if not product:
            return JsonResponse(
                {"error": "O produto é obrigatório."},
                status=HTTPStatus.BAD_REQUEST,
            )
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido."}, status=HTTPStatus.BAD_REQUEST)

    fenomeno = services.update_fenomeno_product(request.user, queimadas_id, product)
    return JsonResponse(serializer.serialize_fenomeno_to_status_and_id(fenomeno))


@require_http_methods(["PATCH"])
def confirm_fenomeno(request: WSGIRequest, queimadas_id: int):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    fenomeno = services.confirm_fenomeno(request.user, queimadas_id)
    return JsonResponse(serializer.serialize_fenomeno_to_status_and_id(fenomeno))


def fenomeno_index(_):
    return JsonResponse({"fenomeno": "fenomeno"})
