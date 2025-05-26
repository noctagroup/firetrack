from firetrack.candidatos.models import Candidato


def register_candidatos(candidatos: list[dict], fenomeno_id: str) -> None:
    for candidato in candidatos:
        Candidato.objects.update_or_create(
            id=candidato["id"],
            fenomeno_id=fenomeno_id,
            defaults={
                "nir": candidato["nir"],
                "red": candidato["red"],
                "thumbnail": candidato["thumbnail"],
                "datetime": candidato["datetime"],
                "valido": None,
            },
        )


def search_candidatos_fenomeno(fenomeno_id: str) -> list[Candidato]:
    pass
