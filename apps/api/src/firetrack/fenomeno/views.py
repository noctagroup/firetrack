from django.http import JsonResponse


def fenomeno_index(_):
    return JsonResponse({"fenomeno": "fenomeno"})
