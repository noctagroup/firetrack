import json
from http import HTTPStatus

from django.core.exceptions import PermissionDenied
from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_GET, require_POST

import firetrack.produtos.services as services
from firetrack.produtos.serializers import serialize_produto


@require_GET
def list_registered_produtos(request: WSGIRequest):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    return JsonResponse(
        [serialize_produto(produto) for produto in services.list_registered_products()],
        safe=False,
    )


@require_GET
def list_all_produtos(request: WSGIRequest):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    return JsonResponse(services.list_all_products(), safe=False)


@require_POST
def register_produto(request: WSGIRequest):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    try:
        data = json.loads(request.body)

        product_id = data.get("product_id")

        return JsonResponse(
            serialize_produto(services.register_product(product_id)), safe=True
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido."}, status=HTTPStatus.BAD_REQUEST)
    except PermissionDenied:
        return HttpResponse(status=HTTPStatus.FORBIDDEN)
