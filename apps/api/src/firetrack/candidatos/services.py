from firetrack.candidatos.models import Candidato


def register_candidatos(candidatos: list[dict], fenomeno_id: str) -> None:
    for candidato in candidatos:
        Candidato.objects.update_or_create(
            fenomeno_id=fenomeno_id,
            id_img=candidato["id"],
            defaults={
                "nir": candidato["bands"]["nir"],
                "red": candidato["bands"]["red"],
                "thumbnail": candidato["thumbnail"],
                "datetime": candidato["datetime"],
                "valido": None,
            },
        )


def search_candidatos_fenomeno(fenomeno_id: str) -> list[Candidato]:
    pass
