from typing import Annotated

from django.contrib.auth.models import AbstractUser
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from pydantic import AfterValidator, BaseModel, Field


class EntrarForm(BaseModel):
    # O comprimento máximo de um email é de 254 caracteres, de acordo com RFC 3696 e RFC 5321.
    query: Annotated[str, Field(min_length=1, max_length=254)]
    password: Annotated[str, Field(min_length=1, max_length=128)]


class CadastrarForm(BaseModel):
    username: Annotated[
        str,
        Field(min_length=1, max_length=150),
        AfterValidator(AbstractUser.username_validator),
    ]
    email: Annotated[
        str, Field(min_length=1, max_length=254), AfterValidator(validate_email)
    ]
    password: Annotated[
        str, Field(min_length=1, max_length=128), AfterValidator(validate_password)
    ]
    password_confirmation: Annotated[str, Field(min_length=1, max_length=128)]
    first_name: Annotated[str, Field(min_length=1, max_length=150)]
    last_name: Annotated[str, Field(min_length=1, max_length=150)]

    # def clean(self):
    #     cleaned_data = super().clean()

    #     password = cleaned_data.get("password")
    #     password_confirmation = cleaned_data.get("password_confirmation")

    #     validate_password(
    #         password,
    #         User(
    #             **{
    #                 attribute: cleaned_data.get(attribute)
    #                 for attribute in UserAttributeSimilarityValidator.DEFAULT_USER_ATTRIBUTES
    #             }
    #         ),
    #     )

    #     if password != password_confirmation:
    #         raise forms.ValidationError(
    #             "Password and password confirmation do not match."
    #         )
