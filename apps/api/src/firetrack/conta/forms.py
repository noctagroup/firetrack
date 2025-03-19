from django import forms


class ContaEntrarForm(forms.Form):
    query = forms.CharField(min_length=1)
    password = forms.CharField(min_length=1)
