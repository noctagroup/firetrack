from django.urls import path

from firetrack.account import views

urlpatterns = [
    path("", views.account_index),
]
