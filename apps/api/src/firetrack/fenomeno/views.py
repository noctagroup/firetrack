from http import HTTPStatus
import json
from datetime import datetime, time

from django.core.handlers.wsgi import WSGIRequest
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET, require_http_methods

from firetrack import fenomeno
from firetrack.fenomeno.models import Fenomeno
import firetrack.fenomeno.serializers as serializer
import firetrack.fenomeno.services as services
from firetrack.fenomeno.state import FenomenoFSM


@require_POST
@csrf_exempt
def create_fenomeno(request: WSGIRequest):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    fenomeno = services.create_and_start_fenomeno(request.user)

    return JsonResponse(serializer.serialize_fenomeno_to_status_and_id(fenomeno))

@require_GET
@csrf_exempt
def get_fenomenos(request: WSGIRequest):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)
    
    data = services.list_user_fenomenos(request.user)
    return JsonResponse({"fenomenos": data}, status=HTTPStatus.OK)


@require_http_methods(["PATCH"])
@csrf_exempt
def update_fenomeno_period(request: WSGIRequest, queimadas_id: int):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    try:
        data = json.loads(request.body)
        start_date = data.get("start_datetime")
        end_date = data.get("end_datetime")

        if not start_date or not end_date:
            return JsonResponse({"error": "Ambas as datas são obrigatórias."}, status=HTTPStatus.BAD_REQUEST)

        fenomeno = services.update_fenomeno_period(request.user, queimadas_id, start_date, end_date)
        return JsonResponse(serializer.serialize_fenomeno_to_status_and_id(fenomeno))
    
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido."}, status=HTTPStatus.BAD_REQUEST)
    except services.InvalidDateFormat as e:
        return JsonResponse({"error": str(e)}, status=HTTPStatus.BAD_REQUEST)
    except services.InvalidDateRange as e:
        return JsonResponse({"error": str(e)}, status=HTTPStatus.BAD_REQUEST)
    except PermissionDenied:
        return HttpResponse(status=HTTPStatus.FORBIDDEN)

def fenomeno_index(_):
    return JsonResponse({"fenomeno": "fenomeno"})
