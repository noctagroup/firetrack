from django.db import models


class Produto(models.Model):
    product_id = models.CharField(max_length=100, primary_key=True)
    description = models.TextField()

    def __str__(self):
        return f"Produto {self.product_id}"
