from django.contrib.auth.models import User


def get_conta(**kwargs) -> User:
    return User.objects.get(**kwargs)
