from datetime import datetime
from typing import List

from django.contrib.auth.models import User
from django.contrib.gis.geos import Polygon
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from firetrack.candidatos.models import Candidato
from firetrack.candidatos.services import (
    register_candidatos,
    search_candidatos_fenomeno_for_visual_analysis,
)
from firetrack.core.exceptions import (
    InvalidDateFormat,
    InvalidDateRange,
    NoCandidatesError,
)
from firetrack.fenomeno.models import Fenomeno
from firetrack.fenomeno.state import FenomenoFSM, FenomenoState
from firetrack.produtos.services import list_registered_products
from firetrack.stac.services import query_product_by_bbox_and_period


def create_and_start_fenomeno(user: User) -> Fenomeno:
    fenomeno = Fenomeno.objects.create(user=user)

    fsm = FenomenoFSM(fenomeno)
    fsm.start()

    return fenomeno


def list_user_fenomenos(user: User) -> List[Fenomeno]:
    fenomenos = Fenomeno.objects.filter(user=user).order_by("-created_at")

    return fenomenos


def update_selected_product(user: User, queimadas_id: int, product: str) -> Fenomeno:
    fenomeno = get_object_or_404(Fenomeno, id=queimadas_id)

    if fenomeno.user != user:
        raise PermissionDenied("Usuário não tem permissão para alterar esse fenômeno")

    if product not in [
        registered_product.product_id
        for registered_product in list_registered_products()
    ]:
        raise ValueError("Produto inválido. O produto não está cadastrado.")

    fenomeno.selected_product = product
    fenomeno.save()
    fsm = FenomenoFSM(fenomeno)
    fsm.select_product()

    return fenomeno


def update_fenomeno_period(
    user, queimadas_id, start_date_str, end_date_str
) -> Fenomeno:
    fenomeno = get_object_or_404(Fenomeno, id=queimadas_id)

    if fenomeno.user != user:
        raise PermissionDenied("Usuário não tem permissão para alterar esse fenômeno")

    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%dT%H:%M:%SZ").date()
        end_date = datetime.strptime(end_date_str, "%Y-%m-%dT%H:%M:%SZ").date()
    except ValueError:
        raise InvalidDateFormat("Formato de data inválido. Use ISO 8601")

    if start_date > end_date:
        raise InvalidDateRange("Data de início deve ser antes ou igual à data final.")

    fenomeno.filter_start_date = start_date
    fenomeno.filter_end_date = end_date
    fenomeno.save()
    fsm = FenomenoFSM(fenomeno)
    fsm.select_timespan()

    return fenomeno


def update_fenomeno_aoi(user: User, queimadas_id: int, aoi: list) -> Fenomeno:
    fenomeno = get_object_or_404(Fenomeno, id=queimadas_id)

    if fenomeno.user != user:
        raise PermissionDenied("Usuário não tem permissão para alterar esse fenômeno")

    if not isinstance(aoi, list) or len(aoi) != 4:
        raise ValueError(
            "Área de interesse (AOI) deve ser uma lista com 4 coordenadas representando os vértices do Bounding Box."
        )

    try:
        polygon = Polygon.from_bbox(aoi)
    except Exception as e:
        raise ValueError(f"Erro ao criar o polígono: {e}")

    fenomeno.aoi = polygon
    fenomeno.save()
    fsm = FenomenoFSM(fenomeno)
    fsm.select_aoi()

    return fenomeno


def update_fenomeno_product(user: User, queimadas_id: int, product: str) -> Fenomeno:
    fenomeno = get_object_or_404(Fenomeno, id=queimadas_id)

    if fenomeno.user != user:
        raise PermissionDenied("Usuário não tem permissão para alterar esse fenômeno")

    registered_products = [p.product_id for p in list_registered_products()]

    if product not in registered_products:
        raise ValueError("Produto inválido. O produto não está cadastrado.")

    fenomeno.product_name = product
    fenomeno.save()
    fsm = FenomenoFSM(fenomeno)
    fsm.select_product()

    return fenomeno


def confirm_fenomeno(user: User, fenomeno_id: int) -> Fenomeno:
    fenomeno: Fenomeno = get_object_or_404(Fenomeno, id=fenomeno_id)

    if fenomeno.user != user:
        raise PermissionDenied("Usuário não tem permissão para confirmar esse fenômeno")

    fsm = FenomenoFSM(fenomeno)

    try:
        register_candidatos(
            query_product_by_bbox_and_period(
                fenomeno.product_name,
                fenomeno.aoi.extent,
                fenomeno.filter_start_date.isoformat(),
                fenomeno.filter_end_date.isoformat(),
            ),
            fenomeno_id,
        )

        fsm.confirm_processing_scope()
    except NoCandidatesError:
        fsm.no_found_candidates()

    except Exception:
        fsm.error()

    return fenomeno


def list_candidatos_visual_analysis(
    user: User, fenomeno_id: int
) -> tuple[str, List[Candidato]]:
    fenomeno: Fenomeno = get_object_or_404(Fenomeno, id=fenomeno_id)

    if fenomeno.user != user:
        raise PermissionDenied("Usuário não tem permissão para acessar esse fenômeno")

    fsm = FenomenoFSM(fenomeno)

    try:
        if fenomeno.state == FenomenoState.READY_FOR_VISUAL_ANALYSIS.value:
            fsm.start_visual_analysis()
        elif fenomeno.state == FenomenoState.IN_VISUAL_ANALYSIS.value:
            fsm.resume_visual_analysis()
        else:
            raise ValueError(
                f"Transição inválida: o estado atual '{fenomeno.state}' não permite análise visual."
            )
    except Exception as e:
        raise ValueError(f"Erro ao realizar a transição de estado: {e}")

    candidatos = search_candidatos_fenomeno_for_visual_analysis(fenomeno)

    return (fenomeno.state, candidatos)


def get_fenomeno_by_id(fenomeno_id: int) -> Fenomeno:
    fenomeno = get_object_or_404(Fenomeno, id=fenomeno_id)
    return fenomeno
