from http import HTTPStatus
from django.http import HttpResponse, JsonResponse
from django.core.handlers.wsgi import WSGIRequest
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from firetrack.conta import serializers
import firetrack.fenomeno.services as services

@require_POST
@csrf_exempt
def create_fenomeno(request: WSGIRequest):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)
    
    user = serializers.serialize_authenticated_user(request.user)
    
    novo_fenomeno = services.create_fenomeno()

    return JsonResponse(novo_fenomeno)

def fenomeno_index(_):
    return JsonResponse({"fenomeno": "fenomeno"})
