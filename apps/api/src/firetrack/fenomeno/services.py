from django.contrib.auth.models import User

from firetrack.fenomeno.models import Fenomeno
from firetrack.fenomeno.state import FenomenoFSM


def create_and_start_fenomeno(user: User) -> Fenomeno:
    fenomeno = Fenomeno.objects.create(user=user)

    fsm = FenomenoFSM(fenomeno)
    fsm.start()

    return fenomeno
