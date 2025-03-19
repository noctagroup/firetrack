import json
from http import HTTPStatus

from django.contrib import auth
from django.core.exceptions import ObjectDoesNotExist
from django.core.handlers.wsgi import WSGIRequest
from django.http.response import HttpResponse, JsonResponse
from django.views.decorators.http import require_GET, require_POST

from firetrack.conta import forms, serializers, services


@require_GET
def conta(request: WSGIRequest):
    if not request.user.is_authenticated:
        return JsonResponse(
            serializers.serialize_anonymous_user(request.user),
            status=HTTPStatus.UNAUTHORIZED,
        )

    return JsonResponse(
        serializers.serialize_authenticated_user(request.user),
        status=HTTPStatus.OK,
    )


@require_POST
def entrar(request: WSGIRequest):
    try:
        form = forms.ContaEntrarForm(json.loads(request.body))

        if not form.is_valid():
            return JsonResponse(dict(form.errors), status=HTTPStatus.BAD_REQUEST)

        query = form.cleaned_data.get("query")
        password = form.cleaned_data.get("password")

        if "@" in query:
            user = services.get_conta(email=query)
        else:
            user = services.get_conta(username=query)

        if not user.check_password(password):
            return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

        auth.login(request, user)

        user = serializers.serialize_authenticated_user(user)

        return JsonResponse(user, status=HTTPStatus.OK)
    except (TypeError, ValueError):
        return HttpResponse(status=HTTPStatus.BAD_REQUEST)
    except ObjectDoesNotExist:
        return HttpResponse(status=HTTPStatus.NOT_FOUND)
    except Exception:
        return HttpResponse(status=HTTPStatus.FORBIDDEN)


# @require_POST
# def register_user(request: WSGIRequest):
#     if request.user.is_authenticated:
#         return JsonResponse({}, status=HTTPStatus.FORBIDDEN)

#     try:
#         user = UserForm.parse_raw(request.body)
#         user = user.dict()
#         user = create_user(
#             username=user.get("username"),
#             password=user.get("password"),
#             email=user.get("email"),
#             first_name=user.get("first_name"),
#             last_name=user.get("last_name"),
#         )

#         login(request, user)

#         return JsonResponse(serialize_authenticated_user(user))

#     except BaseException:
#         return JsonResponse({}, status=HTTPStatus.BAD_REQUEST)


@require_POST
def sair(request: WSGIRequest):
    if request.user.is_authenticated:
        auth.logout(request)

        return HttpResponse(status=HTTPStatus.OK)

    return HttpResponse(status=HTTPStatus.UNAUTHORIZED)
