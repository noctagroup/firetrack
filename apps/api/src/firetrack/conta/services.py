from django.contrib.auth.models import User


def get_conta(**kwargs) -> User:
    return User.objects.get(**kwargs)


def create_conta(**kwargs) -> User:
    return User.objects.create_user(**kwargs)
