from django.urls import path

from firetrack.core import views

urlpatterns = [
    path("", views.core_index),
]
