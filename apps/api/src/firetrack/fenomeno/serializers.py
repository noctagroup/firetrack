from typing import List

from firetrack.fenomeno.models import Fenomeno


def serialize_fenomeno_to_status_and_id(fenomeno: Fenomeno):
    return {"id": fenomeno.id, "status": fenomeno.state}


def serialize_fenomenos_to_admin_info(fenomenos: List[Fenomeno]):
    return [
        {
            "id": fenomeno.id,
            "state": fenomeno.state,
            "product_name": fenomeno.product_name,
            "createad_at": fenomeno.created_at,
        }
        for fenomeno in fenomenos
    ]
