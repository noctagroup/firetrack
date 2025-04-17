from django.urls import path

from firetrack.fenomeno import views

urlpatterns = [
    path("", views.fenomeno_index),
    path("queimadas", views.create_fenomeno),
    path("queimadas/<str:queimadas_id>/area_de_interesse", views.add_aoi_fenomeno),
]
