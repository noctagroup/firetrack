from typing import Annotated, Optional, Self

from django.contrib.auth.models import AbstractUser, User
from django.contrib.auth.password_validation import (
    UserAttributeSimilarityValidator as DjangoUserAttributeSimilarityValidator,
)
from django.contrib.auth.password_validation import (
    validate_password as django_validate_password,
)
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import validate_email as django_validate_email
from pydantic import AfterValidator, BaseModel, Field, model_validator


def validate_username(username: str) -> None:
    try:
        AbstractUser.username_validator(username)
    except DjangoValidationError as exc:
        raise ValueError(exc.messages)


def validate_email(email: str) -> None:
    try:
        django_validate_email(email)
    except DjangoValidationError as exc:
        raise ValueError(exc.messages)


def validate_password(password: str, user: Optional[User] = None) -> None:
    try:
        django_validate_password(password, user)
    except DjangoValidationError as exc:
        raise ValueError(exc.messages)


class EntrarForm(BaseModel):
    query: Annotated[str, Field(min_length=1, max_length=254)]
    password: Annotated[str, Field(min_length=1, max_length=128)]


class CadastrarForm(BaseModel):
    username: Annotated[
        str, Field(min_length=1, max_length=150), AfterValidator(validate_username)
    ]
    # O comprimento máximo de um email é de 254 caracteres, de acordo com RFC 3696 e RFC 5321.
    email: Annotated[
        str, Field(min_length=1, max_length=254), AfterValidator(validate_email)
    ]
    password: Annotated[str, Field(min_length=1, max_length=128)]
    password_confirmation: Annotated[str, Field(min_length=1, max_length=128)]
    first_name: Annotated[str, Field(min_length=1, max_length=150)]
    last_name: Annotated[str, Field(min_length=1, max_length=150)]

    @model_validator(mode="after")
    def validate_password_similarity(self) -> Self:
        user_dict = dict(self)
        user_model = User(
            **{
                attribute: user_dict.get(attribute)
                for attribute in DjangoUserAttributeSimilarityValidator.DEFAULT_USER_ATTRIBUTES
            }
        )

        validate_password(self.password, user_model)

        return self

    @model_validator(mode="after")
    def check_passwords(self) -> Self:
        if self.password != self.password_confirmation:
            raise ValueError("Password confirmation does not match password.")

        return self
