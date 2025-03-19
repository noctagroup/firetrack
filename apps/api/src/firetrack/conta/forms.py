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
    password = forms.CharField()
    password_confirmation = forms.CharField()

    def clean_password(self):
        password = self.cleaned_data.get("password")

        validate_password(
            password,
            User(
                **{
                    attribute: self.cleaned_data.get(attribute)
                    for attribute in UserAttributeSimilarityValidator.DEFAULT_USER_ATTRIBUTES
                }
            ),
        )

        return password

    def clean_password_confirmation(self):
        password = self.cleaned_data.get("password")
        password_confirmation = self.cleaned_data.get("password_confirmation")

        if password != password_confirmation:
            raise forms.ValidationError(
                "Password and password confirmation do not match."
            )

        return password_confirmation
