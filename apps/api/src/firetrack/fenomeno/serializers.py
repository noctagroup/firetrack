from typing import List

from firetrack.candidatos.models import Candidato
from firetrack.fenomeno.models import Fenomeno
from firetrack.pares.models import Pares


def serialize_fenomenos_to_visualization(fenomenos: list[Fenomeno]) -> dict:
    fenomenos_dict = {"fenomenos": [], "aguardandoAnalise": [], "emProcessamento": []}
    for fenomeno in fenomenos:
        if fenomeno.state == "PUBLISHED":
            fenomenos_dict["fenomenos"].append(
                {
                    "id": fenomeno.id,
                    "title": "Processamento" + str(fenomeno.id),
                    "dataInicio": fenomeno.filter_start_date,
                    "dataFim": fenomeno.filter_end_date,
                    "produto": fenomeno.product_name,
                }
            )
        elif fenomeno.state == "READY_FOR_VISUAL_ANALYSIS":
            fenomenos_dict["aguardandoAnalise"].append(
                {
                    "id": fenomeno.id,
                    "title": "Processamento " + str(fenomeno.id),
                    "dataInicio": fenomeno.filter_start_date,
                    "dataFim": fenomeno.filter_end_date,
                    "produto": fenomeno.product_name,
                }
            )
        else:
            fenomenos_dict["emProcessamento"].append(
                {
                    "id": fenomeno.id,
                    "title": "Processamento " + str(fenomeno.id),
                    "dataInicio": fenomeno.filter_start_date,
                    "dataFim": fenomeno.filter_end_date,
                    "produto": fenomeno.product_name,
                    "estado": fenomeno.state,
                }
            )

    return fenomenos_dict


def serialize_fenomeno_to_status_and_id(fenomeno: Fenomeno):
    return {"id": fenomeno.id, "status": fenomeno.state}


def serialize_fenomenos_to_admin_info(fenomenos: List[Fenomeno]):
    return [
        {
            "id": fenomeno.id,
            "state": fenomeno.state,
            "product_name": fenomeno.product_name,
            "aoi": fenomeno.aoi.extent,
            "filter_start_date": fenomeno.filter_start_date.isoformat(),
            "filter_end_date": fenomeno.filter_end_date.isoformat(),
            "created_at": fenomeno.created_at.isoformat(),
        }
        for fenomeno in fenomenos
    ]


def serialize_candidatos_to_visual_analysis(
    state: str, candidatos: list[Candidato]
) -> list[dict]:
    res = {"state": state, "candidates": {}}

    for candidato in candidatos:
        if candidato.path_row not in res["candidates"]:
            res["candidates"][candidato.path_row] = []

        res["candidates"][candidato.path_row].append(
            {
                "id": candidato.id_img,
                "datetime": candidato.datetime.isoformat(),
                "thumb": candidato.thumbnail,
                "valid": candidato.valid,
            }
        )

    return res


def serialize_valid_pairs(valid_pairs: List[Pares]) -> List[dict]:
    return [
        {
            "candidato_pre": {
                "id": pair.candidato_pre.id_img,
                "datetime": pair.candidato_pre.datetime.isoformat(),
            },
            "candidato_pos": {
                "id": pair.candidato_pos.id_img,
                "datetime": pair.candidato_pre.datetime.isoformat(),
            },
        }
        for pair in valid_pairs
    ]
