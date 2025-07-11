from http import HTTPStatus

from django.contrib import auth
from django.core.exceptions import ObjectDoesNotExist
from django.core.handlers.wsgi import WSGIRequest
from django.db.utils import IntegrityError
from django.http.response import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from pydantic import ValidationError

from firetrack.conta import forms, serializers, services
from firetrack.conta.utils import is_email


@require_GET
def conta(request: WSGIRequest):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    user = serializers.serialize_authenticated_user(request.user)

    return JsonResponse(user, status=HTTPStatus.OK)


@require_POST
@csrf_exempt
def entrar(request: WSGIRequest):
    if request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    try:
        form = forms.EntrarForm.model_validate_json(request.body)

        if is_email(form.query):
            user = services.get_conta(email=form.query)
        else:
            user = services.get_conta(username=form.query)

        if not user.check_password(form.password):
            return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

        auth.login(request, user)

        user = serializers.serialize_authenticated_user(user)

        return JsonResponse(user, status=HTTPStatus.OK)
    except ValidationError as exc:
        return HttpResponse(
            exc.json(),
            status=HTTPStatus.BAD_REQUEST,
            content_type="application/json",
        )
    except ObjectDoesNotExist:
        return HttpResponse(status=HTTPStatus.NOT_FOUND)


@require_POST
@csrf_exempt
def cadastrar(request: WSGIRequest):
    if request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    try:
        form = forms.CadastrarForm.model_validate_json(request.body)
        user = services.create_conta(
            first_name=form.first_name,
            last_name=form.last_name,
            username=form.username,
            email=form.email,
            password=form.password,
        )

        auth.login(request, user)

        user = serializers.serialize_authenticated_user(user)

        return JsonResponse(user, status=HTTPStatus.OK)
    except ValidationError as exc:
        return HttpResponse(
            exc.json(),
            status=HTTPStatus.BAD_REQUEST,
            content_type="application/json",
        )
    except IntegrityError:
        return HttpResponse(status=HTTPStatus.CONFLICT)


@require_POST
def sair(request: WSGIRequest):
    if not request.user.is_authenticated:
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

    auth.logout(request)

    return HttpResponse(status=HTTPStatus.OK)
