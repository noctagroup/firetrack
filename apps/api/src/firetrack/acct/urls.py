from django.urls import path

from firetrack.acct import views

urlpatterns = [
    path("", views.acct_index),
]
