from django.contrib.auth.models import User
from django.contrib.gis.geos import Polygon
from django.shortcuts import get_object_or_404

from firetrack.fenomeno.models import Fenomeno
from firetrack.fenomeno.state import FenomenoFSM


def create_and_start_fenomeno(user: User) -> Fenomeno:
    fenomeno = Fenomeno.objects.create(user=user)

    fsm = FenomenoFSM(fenomeno)
    if fsm.state == "idle":
        fsm.start()
    else:
        raise Exception(
            f"Não foi possível iniciar o fenômeno: estado atual inválido '{fsm.state}' (esperado: 'idle')."
        )

    return fenomeno


def add_aoi_to_fenomeno(fenomeno_id: str, bbox: list) -> Fenomeno:
    if len(bbox) != 4:
        raise ValueError(
            "A BBOX deve conter exatamente 4 valores: [min_x, max_x, min_y, max_y]"
        )

    min_x, max_x, min_y, max_y = bbox

    polygon = Polygon.from_bbox((min_x, min_y, max_x, max_y))
    polygon.srid = 4326

    fenomeno = get_object_or_404(Fenomeno, id=int(fenomeno_id))
    fenomeno.aoi = polygon
    fenomeno.save()

    fsm = FenomenoFSM(fenomeno)
    if fsm.state == "timespan_selected":
        fsm.select_aoi()
    else:
        raise Exception(
            f"Não foi possível adicionar a AOI: estado atual inválido '{fsm.state}' (esperado: 'timespan_selected')."
        )

    return fenomeno
