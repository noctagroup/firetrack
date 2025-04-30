# models.py
from django.contrib.auth.models import User
from django.contrib.gis.db import models as gis_models
from django.db import models

from .enums import FenomenoState


class Fenomeno(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="fenomenos")

    state = models.CharField(
        max_length=40, choices=FenomenoState.choices(), default=FenomenoState.IDLE.value
    )

    product_name = models.TextField(null=True, blank=True)

    filter_start_date = models.DateField(null=True, blank=True)
    filter_end_date = models.DateField(null=True, blank=True)

    aoi = gis_models.PolygonField(
        null=True,
        blank=True,
        srid=4326,
        help_text="Área de interesse (Bounding Box) no sistema WGS84",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Fenomeno {self.id} - {self.state}"

    def set_state(self, new_state: FenomenoState):
        self.state = new_state.value
        self.save()
