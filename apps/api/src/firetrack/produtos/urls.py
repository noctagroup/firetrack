from django.urls import path

from firetrack.produtos import views

urlpatterns = [
    path("", views.list_registered_produtos),
    path("all", views.list_all_produtos),
    path("create", views.register_produto),
]
