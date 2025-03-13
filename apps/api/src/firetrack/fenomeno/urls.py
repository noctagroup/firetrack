from django.urls import path

from firetrack.conta import views

urlpatterns = [
    path("", views.conta_index),
]
