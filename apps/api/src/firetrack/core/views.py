from django.http import JsonResponse


def core_index(_):
    return JsonResponse({"module": "auth"})
