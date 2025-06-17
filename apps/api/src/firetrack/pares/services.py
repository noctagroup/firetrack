import logging
from firetrack.candidatos.models import Candidato
from firetrack.fenomeno.models import Fenomeno
from firetrack.fenomeno.state import FenomenoFSM
from firetrack.pares.models import Pares

logger = logging.getLogger(__name__)


def separate_pares(
    fenomeno: Fenomeno,
    candidatos_by_path_row_ordered: dict[str, list[Candidato]],
    regrowth_threshold: int,
) -> list[Pares]:
    logger.debug(
        f"Separando pares para {len(candidatos_by_path_row_ordered)} grupos de path_row com limiar de rebrota: {regrowth_threshold} dias"
    )
    fsm = FenomenoFSM(fenomeno)
    fsm.start_valid_pair_separation()

    valid_pares = []
    for path_row, candidatos in candidatos_by_path_row_ordered.items():
        logger.debug(
            f"Processando path_row: {path_row} com {len(candidatos)} candidatos"
        )
        for i in range(len(candidatos) - 1):
            candidato_pre = candidatos[i]
            candidato_pos = candidatos[i + 1]
            diff = (candidato_pos.datetime - candidato_pre.datetime).days
            if 0 < diff < regrowth_threshold:
                logger.info(
                    f"Par: {candidato_pre.id_img} -> {candidato_pos.id_img} ({path_row}) | Diferença: {diff} dias"
                )
                valid_pares.append(
                    Pares.objects.create(
                        candidato_pre=candidato_pre,
                        candidato_pos=candidato_pos,
                        fenomeno=candidato_pre.fenomeno,
                    )
                )
            else:
                logger.info(
                    f"Não é um par: {candidato_pre.id_img} -> {candidato_pos.id_img} ({path_row}) | Diferença: {diff} dias"
                )

    if not valid_pares:
        logger.warning("Nenhum par válido encontrado.")
        fsm.no_valid_pairs()
        return valid_pares

    fsm.finish_valid_pair_separation()

    logger.debug(f"Total de pares válidos encontrados: {len(valid_pares)}")
    return valid_pares


def list_pares_by_fenomeno(fenomeno: Fenomeno) -> list[Pares]:
    logger.debug(f"Listando pares para o fenômeno {fenomeno.id}")
    return list(
        Pares.objects.filter(fenomeno=fenomeno).order_by("candidato_pre__datetime")
    )
