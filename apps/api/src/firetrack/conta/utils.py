from django.core.exceptions import ValidationError
from django.core.validators import validate_email


def is_email(email) -> bool:
    try:
        validate_email(email)
        return True
    except ValidationError:
        return False
