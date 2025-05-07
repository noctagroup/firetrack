from django.urls import path

from firetrack.fenomeno import views

urlpatterns = [
    path("", views.fenomeno_index),    
    path("queimadas", views.get_fenomenos),
    path("queimadas/", views.create_fenomeno),
    path("queimadas/<int:queimadas_id>/period", views.update_fenomeno_period)
]
