from django.urls import path

from firetrack.fenomeno import views

urlpatterns = [
    path("", views.fenomeno_index),
]
