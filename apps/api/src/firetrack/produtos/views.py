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
        regrowth_threshold = data.get("regrowth_threshold")

        if not product_id:
            return JsonResponse(
                {"error": "product_id é obrigatório."}, status=HTTPStatus.BAD_REQUEST
            )

        if regrowth_threshold is None:
            return JsonResponse(
                {"error": "regrowth_threshold é obrigatório."},
                status=HTTPStatus.BAD_REQUEST,
            )

        produto, created = services.register_product(product_id, regrowth_threshold)

        status = HTTPStatus.CREATED if created else HTTPStatus.OK

        return JsonResponse(serialize_produto(produto), status=status)

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido."}, status=HTTPStatus.BAD_REQUEST)
    except PermissionDenied:
        return HttpResponse(status=HTTPStatus.FORBIDDEN)
