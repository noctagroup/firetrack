from datetime import datetime
from typing import List

from django.contrib.auth.models import User
from django.contrib.gis.geos import Polygon
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from firetrack.core.exceptions import InvalidDateFormat, InvalidDateRange
from firetrack.fenomeno.models import Fenomeno
from firetrack.fenomeno.state import FenomenoFSM
from firetrack.produtos.services import list_registered_products


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

    if product not in ["MODIS", "VIIRS"]:
        raise ValueError("Produto inválido. Use 'MODIS' ou 'VIIRS'.")

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
    """ fsm.select_product() """
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
