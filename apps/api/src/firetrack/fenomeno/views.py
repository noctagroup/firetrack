import json
from http import HTTPStatus

from django.core.exceptions import PermissionDenied
from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_GET, require_http_methods, require_POST

import firetrack.candidatos.services as CandidatosServices
import firetrack.pares.services as ParesServices
import firetrack.produtos.services as ProdutosService
import firetrack.fenomeno.serializers as serializer
import firetrack.fenomeno.services as services


@require_POST
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


@require_GET
def get_fenomeno_by_id(request: WSGIRequest, queimadas_id: int):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    fenomeno = services.get_fenomeno_by_id(queimadas_id)

    return JsonResponse(serializer.serialize_fenomenos_to_admin_info(fenomeno))


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


@require_GET
def list_candidatos_visual_analysis(request: WSGIRequest, queimadas_id: int):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    state, candidates = services.list_candidatos_visual_analysis(
        request.user, queimadas_id
    )
    return JsonResponse(
        serializer.serialize_candidatos_to_visual_analysis(state, candidates)
    )


@require_POST
def confirm_visual_analysis(request: WSGIRequest, queimadas_id: int):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    try:
        data = json.loads(request.body)
        candidates = data.get("validated_candidates")
        if not candidates or not isinstance(candidates, list):
            return JsonResponse(
                {"error": "A lista de candidatos é obrigatória."},
                status=HTTPStatus.BAD_REQUEST,
            )

        CandidatosServices.confirm_candidatos_visual_analysis(
            request.user, queimadas_id, candidates
        )

        candidatos_path_row = CandidatosServices.get_candidatos_validados_por_path_row(
            queimadas_id
        )

        fenomeno = services.get_fenomeno_by_id(queimadas_id)

        regrowth_threshold = ProdutosService.get_product_threshold(
            fenomeno.product_name
        )

        pares_validos = ParesServices.separate_pares(
            fenomeno, candidatos_path_row, regrowth_threshold
        )

        return JsonResponse(
            {"valid_pairs": serializer.serialize_valid_pairs(pares_validos)}
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido."}, status=HTTPStatus.BAD_REQUEST)


@require_GET
def fenomeno_index(request: WSGIRequest):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    fenomenos = services.list_user_fenomenos(request.user)

    return JsonResponse(serializer.serialize_fenomenos_to_visualization(fenomenos))
