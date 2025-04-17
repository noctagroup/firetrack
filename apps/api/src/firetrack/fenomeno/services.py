from django.contrib.auth.models import User

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
