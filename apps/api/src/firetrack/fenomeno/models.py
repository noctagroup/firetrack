from django.contrib.auth.models import User
from django.contrib.gis.db import models as gis_models
from django.db import models

class Fenomeno(models.Model):
    STATE_CHOICES = [
        ('idle', 'Idle'),
        ('started', 'Started'),
        ('product_selected', 'Product Selected'),
        ('timespan_selected', 'Timespan Selected'),
        ('aoi_selected', 'AOI Selected'),
        ('ready_for_visual_analysis', 'Ready for Visual Analysis'),
        ('in_visual_analysis', 'In Visual Analysis'),
        ('ready_for_valid_pair_separation', 'Ready for Valid Pair Separation'),
        ('in_valid_pair_separation', 'In Valid Pair Separation'),
        ('ready_for_indexes_creation', 'Ready for Indexes Creation'),
        ('in_indexes_creation', 'In Indexes Creation'),
        ('ready_for_difference_image_creation', 'Ready for Difference Image Creation'),
        ('in_difference_image_creation', 'In Difference Image Creation'),
        ('ready_for_ai_classification', 'Ready for AI Classification'),
        ('in_ai_classification', 'In AI Classification'),
        ('ready_for_publish', 'Ready for Publish'),
        ('published', 'Published'),
        ('error', 'Error'),
        ('aborted', 'Aborted'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='fenomenos'
    )

    state = models.CharField(
        max_length=40,
        choices=STATE_CHOICES,
        default='idle'
    )

    product_name = models.TextField(null=True, blank=True)

    filter_start_date = models.DateField(null=True, blank=True)
    filter_end_date = models.DateField(null=True, blank=True)

    aoi = gis_models.PolygonField(
        null=True,
        blank=True,
        srid=4326,
        help_text="Área de interesse (Bounding Box) no sistema WGS84"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Fenomeno {self.id} - {self.state}'
