from django.http import JsonResponse


def pintomucho(request):
    return JsonResponse({"message": "abc"})
