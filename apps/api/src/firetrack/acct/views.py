from django.http import JsonResponse


def acct_index(_):
    return JsonResponse({"module": "acct"})
