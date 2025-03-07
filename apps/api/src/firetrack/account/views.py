from django.http import JsonResponse


def account_index(_):
    return JsonResponse({"module": "account"})
