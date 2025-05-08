from firetrack.fenomeno.models import Fenomeno


def serialize_fenomeno_to_status_and_id(fenomeno: Fenomeno):
    return {"id": fenomeno.id, "status": fenomeno.state}
