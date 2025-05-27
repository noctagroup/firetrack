from django.urls import path

from firetrack.fenomeno import views

urlpatterns = [
    path("", views.fenomeno_index),
    path("queimadas", views.get_fenomenos),
    path("queimadas/", views.create_fenomeno),
    path("queimadas/<int:queimadas_id>/period", views.update_fenomeno_period),
    path("queimadas/<int:queimadas_id>/product", views.update_fenomeno_product),
    path("queimadas/<int:queimadas_id>/aoi", views.update_fenomeno_aoi),
    path("queimadas/<int:queimadas_id>/confirm", views.confirm_fenomeno),
]
