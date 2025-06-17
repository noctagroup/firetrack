import logging
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from firetrack.candidatos.models import Candidato
from firetrack.fenomeno.models import Fenomeno
from firetrack.fenomeno.state import FenomenoFSM

logger = logging.getLogger(__name__)


def _extract_metadata_id(candidato_id: str) -> tuple[int, int]:
    words_list = candidato_id.split("_")

    row = words_list[-2]
    path = words_list[-3]
    return (int(path), int(row), f"{path}_{row}")


def register_candidatos(candidatos: list[dict], fenomeno_id: str) -> None:
    logger.debug(
        f"Registrando {len(candidatos)} candidatos para o fenômeno {fenomeno_id}"
    )

    for candidato in candidatos:
        path, row, path_row = _extract_metadata_id(candidato["id"])
        obj, created = Candidato.objects.update_or_create(
            fenomeno_id=fenomeno_id,
            id_img=candidato["id"],
            defaults={
                "nir": candidato["bands"]["nir"],
                "red": candidato["bands"]["red"],
                "thumbnail": candidato["thumbnail"],
                "path": path,
                "row": row,
                "path_row": path_row,
                "datetime": candidato["datetime"],
                "valid": None,
            },
        )
        if created:
            logger.info(f"Candidato {obj.id_img} criado.")
        else:
            logger.info(f"Candidato {obj.id_img} atualizado.")


def search_candidatos_fenomeno_for_visual_analysis(
    fenomeno: Fenomeno,
) -> list[Candidato]:
    return list(Candidato.objects.filter(fenomeno=fenomeno).order_by("datetime"))


def confirm_candidatos_visual_analysis(
    user: User, fenomeno_id: int, candidates: list[dict]
) -> list[Candidato]:
    logger.debug(
        f"Confirmando {len(candidates)} candidatos para o fenômeno {fenomeno_id}"
    )

    fenomeno = get_object_or_404(Fenomeno, id=fenomeno_id)

    if fenomeno.user != user:
        raise PermissionDenied("Usuário não tem permissão para alterar esse fenômeno")

    for candidate in candidates:
        Candidato.objects.filter(
            fenomeno_id=fenomeno_id,
            id_img=candidate["id_img"],
        ).update(valid=candidate["valid"])
        valido = "válido" if candidate["valid"] else "inválido"
        logger.info(f"Candidato {candidate['id_img']} atualizado para {valido}.")

    fsm = FenomenoFSM(fenomeno)
    fsm.finish_visual_analysis()

    return fenomeno


def get_candidatos_validados_por_path_row(fenomeno_id: int):
    candidatos = Candidato.objects.filter(fenomeno_id=fenomeno_id, valid=True).order_by(
        "path_row", "datetime"
    )

    agrupados = {}
    for candidato in candidatos:
        agrupados.setdefault(candidato.path_row, []).append(candidato)
    return agrupados
