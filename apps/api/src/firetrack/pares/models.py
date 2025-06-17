from django.db import models

from firetrack.candidatos.models import Candidato
from firetrack.fenomeno.models import Fenomeno


class Pares(models.Model):
    candidato_pre = models.ForeignKey(
        Candidato, on_delete=models.CASCADE, related_name="imagem_pre"
    )
    candidato_pos = models.ForeignKey(
        Candidato, on_delete=models.CASCADE, related_name="imagem_pos"
    )
    fenomeno = models.ForeignKey(
        Fenomeno, on_delete=models.CASCADE, related_name="fenomeno"
    )

    def __str__(self):
        return f"Par {self.candidato_pre.id}/{self.can.id} relacionado ao Fenomeno {self.fenomeno.id}"
