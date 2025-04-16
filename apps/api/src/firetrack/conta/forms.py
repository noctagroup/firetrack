from typing import Annotated, Any, Optional, Self

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import (
    UserAttributeSimilarityValidator,
    get_default_password_validators,
)
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import EmailValidator
from pydantic import (
    BaseModel,
    BeforeValidator,
    Field,
    ModelWrapValidatorHandler,
    ValidationError,
    model_validator,
)
from pydantic import ValidationError as PydanticValidationError
from pydantic_core import InitErrorDetails, PydanticCustomError


def validate_username(username: str) -> str:
    username_validator = UnicodeUsernameValidator()

    try:
        username_validator(username)
    except DjangoValidationError as error:
        raise ValueError(error.messages[0])

    return username


def validate_email(email: str) -> str:
    email_validator = EmailValidator()

    try:
        email_validator(email)
    except DjangoValidationError as error:
        raise ValueError(error.messages[0])

    return email


def validate_password(
    password: str,
    user: Optional[User] = None,
    *,
    field="password",
) -> str:
    validators = get_default_password_validators()
    errors: list[InitErrorDetails] = []

    for validator in validators:
        try:
            validator.validate(password, user)
        except DjangoValidationError as error:
            errors.append(
                InitErrorDetails(
                    type=PydanticCustomError(error.code, error.messages[0]),
                    input=password,
                    loc=(field,),
                )
            )

    if errors:
        raise ValueError(errors)

    return password


class EntrarForm(BaseModel):
    query: Annotated[str, Field(min_length=1, max_length=254)]
    password: Annotated[str, Field(min_length=1, max_length=128)]


class CadastrarForm(BaseModel):
    first_name: Annotated[str, Field(min_length=1, max_length=150)]
    last_name: Annotated[str, Field(min_length=1, max_length=150)]
    username: Annotated[
        str, Field(min_length=1, max_length=150), BeforeValidator(validate_username)
    ]
    # O comprimento máximo de um email é de 254 caracteres, de acordo com RFC 3696 e RFC 5321.
    email: Annotated[
        str, Field(min_length=1, max_length=254), BeforeValidator(validate_email)
    ]
    password: Annotated[str, Field(min_length=1, max_length=128)]

    @model_validator(mode="wrap")
    @classmethod
    def validate_password_similarity(
        cls, data: Any, handler: ModelWrapValidatorHandler[Self]
    ) -> Self:
        errors: list[InitErrorDetails] = []

        try:
            user_validated = handler(data)
        except PydanticValidationError as error:
            errors.extend(error.errors())

        if not (isinstance(data, dict) or isinstance(data, cls)):
            raise ValidationError.from_exception_data(
                title=cls.__class__.__name__,
                line_errors=errors,
            )

        def getuserattr(attribute: str) -> Optional[str]:
            return (
                data.get(attribute, None)
                if isinstance(data, dict)
                else getattr(data, attribute, None)
            )

        try:
            user_model = User(
                **{
                    attribute: getuserattr(attribute)
                    for attribute in UserAttributeSimilarityValidator.DEFAULT_USER_ATTRIBUTES
                }
            )

            validate_password(getuserattr("password"), user_model)
        except ValueError as error:
            errors.extend(error.args[0])

        if errors:
            raise ValidationError.from_exception_data(
                title=cls.__class__.__name__,
                line_errors=errors,
            )

        return user_validated
