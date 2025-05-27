from django.db import models
from django.db.models import UniqueConstraint

from firetrack.fenomeno.models import Fenomeno


class Candidato(models.Model):
    id_img = models.CharField(
        max_length=100,
        help_text="Identificador único do candidato (ex: CBERS_4_AWFI_DRD_20230102_172_111_L2)",
    )
    fenomeno = models.ForeignKey(
        Fenomeno, on_delete=models.CASCADE, related_name="candidatos"
    )
    nir = models.URLField(help_text="Link para o arquivo da banda NIR")
    red = models.URLField(help_text="Link para o arquivo da banda RED")
    thumbnail = models.URLField(help_text="Link para o arquivo do thumbnail")
    datetime = models.DateTimeField(help_text="Data e hora do fenômeno")
    valido = models.BooleanField(
        null=True,
        blank=True,
        help_text="Indica se o candidato é válido ou não",
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=["id_img", "fenomeno"], name="unique_candidato_id_fenomeno"
            )
        ]

    def __str__(self):
        return f"Candidato {self.id} relacionado ao Fenomeno {self.fenomeno.id}"
