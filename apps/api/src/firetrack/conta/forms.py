from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import (
    UserAttributeSimilarityValidator,
    validate_password,
)
from django.contrib.auth.validators import UnicodeUsernameValidator


class ContaEntrarForm(forms.Form):
    query = forms.CharField(
        min_length=1,
    )
    password = forms.CharField(
        min_length=1,
    )


class ContaCadastrarForm(forms.Form):
    username_validator = UnicodeUsernameValidator()

    username = forms.CharField(
        min_length=1,
        max_length=150,
        validators=[username_validator],
    )
    first_name = forms.CharField(
        min_length=1,
        max_length=150,
    )
    last_name = forms.CharField(
        min_length=1,
        max_length=150,
    )
    email = forms.EmailField()
    password = forms.CharField(min_length=1)
    password_confirmation = forms.CharField(min_length=1)

    def clean(self):
        cleaned_data = super().clean()

        password = cleaned_data.get("password")
        password_confirmation = cleaned_data.get("password_confirmation")

        validate_password(
            password,
            User(
                **{
                    attribute: cleaned_data.get(attribute)
                    for attribute in UserAttributeSimilarityValidator.DEFAULT_USER_ATTRIBUTES
                }
            ),
        )

        if password != password_confirmation:
            raise forms.ValidationError(
                "Password and password confirmation do not match."
            )
