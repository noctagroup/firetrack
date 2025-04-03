from typing import Annotated, Optional, Self

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import (
    UserAttributeSimilarityValidator,
    get_default_password_validators,
)
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from pydantic import AfterValidator, BaseModel, Field, model_validator


def validate_username(username: str) -> None:
    username_validator = UnicodeUsernameValidator()

    try:
        username_validator(username)
    except ValidationError as error:
        raise ValueError(error.messages)


def validate_email(email: str) -> None:
    email_validator = EmailValidator()

    try:
        email_validator(email)
    except ValidationError as error:
        raise ValueError(error.messages)


def validate_password(password: str, user: Optional[User] = None) -> None:
    messages = []
    validators = get_default_password_validators()

    for validator in validators:
        try:
            validator.validate(password, user)
        except ValidationError as error:
            messages.extend(error.messages)

    if messages:
        raise ValueError(messages)


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
                for attribute in UserAttributeSimilarityValidator.DEFAULT_USER_ATTRIBUTES
            }
        )

        validate_password(self.password, user_model)

        return self

    @model_validator(mode="after")
    def check_passwords(self) -> Self:
        if self.password != self.password_confirmation:
            raise ValueError("Password confirmation does not match password.")

        return self
