from firetrack.fenomeno.models import Fenomeno


def create_fenomeno(**kwargs) -> Fenomeno:
    fenomeno = Fenomeno()
    return Fenomeno.save(fenomeno)
