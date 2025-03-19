from django.contrib.auth.models import AnonymousUser, User


def serialize_anonymous_user(user: AnonymousUser) -> dict:
    return {
        "is_authenticated": user.is_authenticated,
    }


def serialize_authenticated_user(user: User) -> dict:
    return {
        "id": user.pk,
        "username": user.username,
        "email": user.email,
        "full_name": user.get_full_name(),
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_authenticated": user.is_authenticated,
    }
