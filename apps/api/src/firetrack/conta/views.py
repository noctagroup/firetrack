from django.http import JsonResponse


def conta_index(_):
    return JsonResponse({ "conta": "conta" })
