from django.urls import path

from firetrack.conta import views

urlpatterns = [
    path("", views.conta),
    path("entrar", views.entrar),
    path("sair", views.sair),
    path("cadastrar", views.cadastrar),
]
