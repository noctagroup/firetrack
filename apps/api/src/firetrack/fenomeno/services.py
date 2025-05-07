from datetime import datetime, time

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied

from firetrack.fenomeno.models import Fenomeno
from firetrack.fenomeno.state import FenomenoFSM


class InvalidDateFormat(Exception):
    pass

class InvalidDateRange(Exception):
    pass


def create_and_start_fenomeno(user: User) -> Fenomeno:
    fenomeno = Fenomeno.objects.create(user=user)

    fsm = FenomenoFSM(fenomeno)
    fsm.start()

    return fenomeno

def list_user_fenomenos(user):
    fenomenos = Fenomeno.objects.filter(user=user).order_by('-created_at')

    def format_datetime(d, end=False):
        if not d:
            return None
        t = time.max if end else time.min
        dt = datetime.combine(d, t)
        return dt.isoformat(timespec='seconds') + 'Z'

    return [
        {
            "id": f.id,
            "state": f.state,
            "product_name": f.product_name,
            "filter_start_date": format_datetime(f.filter_start_date),
            "filter_end_date": format_datetime(f.filter_end_date, end=True),
            "created_at": f.created_at.isoformat(timespec='seconds') + 'Z',
            "updated_at": f.updated_at.isoformat(timespec='seconds') + 'Z',
        }
        for f in fenomenos
    ]

def update_fenomeno_period(user, queimadas_id, start_date_str, end_date_str) -> Fenomeno:
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