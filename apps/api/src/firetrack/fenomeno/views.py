from http import HTTPStatus

from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

import firetrack.fenomeno.serializers as serializer
import firetrack.fenomeno.services as services


@require_POST
@csrf_exempt
def create_fenomeno(request: WSGIRequest):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    fenomeno = services.create_and_start_fenomeno(request.user)

    return JsonResponse(serializer.serialize_fenomeno_to_status_and_id(fenomeno))


def fenomeno_index(_):
    return JsonResponse({"fenomeno": "fenomeno"})
