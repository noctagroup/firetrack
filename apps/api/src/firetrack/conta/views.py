import json
from http import HTTPStatus

from django.contrib import auth
from django.core.exceptions import ObjectDoesNotExist
from django.core.handlers.wsgi import WSGIRequest
from django.forms import ValidationError
from django.http.response import HttpResponse, JsonResponse
from django.middleware import csrf
from django.views.decorators.http import require_GET, require_POST

from firetrack.conta import forms, serializers, services


@require_GET
def conta(request: WSGIRequest):
    csrf.get_token(request)

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
        conta_payload = json.loads(request.body)
        conta_form = forms.ContaEntrarForm(conta_payload)

        if not conta_form.is_valid():
            raise ValidationError(conta_form.errors)

        conta_query = conta_form.data.get("query")
        conta_password = conta_form.data.get("password")

        if "@" in conta_query:
            user = services.get_conta(email=conta_query)
        else:
            user = services.get_conta(username=conta_query)

        if not user.check_password(conta_password):
            return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

        auth.login(request, user)

        user = serializers.serialize_authenticated_user(user)

        return JsonResponse(user, status=HTTPStatus.OK)
    except ValidationError as error:
        return JsonResponse(dict(error), status=HTTPStatus.BAD_REQUEST)
    except ValueError:
        return HttpResponse(status=HTTPStatus.BAD_REQUEST)
    except ObjectDoesNotExist:
        return HttpResponse(status=HTTPStatus.NOT_FOUND)
    except Exception:
        return HttpResponse(status=HTTPStatus.FORBIDDEN)


# @require_POST
# @csrf_exempt
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
