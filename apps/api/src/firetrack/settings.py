"""
Django settings for firetrack project.

Generated by 'django-admin startproject' using Django 5.1.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path

from corsheaders.defaults import default_headers, default_methods
from decouple import Csv, config

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config(
    "DJANGO_SECRET_KEY",
    default="4=4lj5)^-+-oa+9dngm9ickrbg-$h^$p)lb)l@$1!u@5#2q6ok",
    cast=str,
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config("DJANGO_DEBUG", default=True, cast=bool)

ALLOWED_HOSTS = config(
    "DJANGO_ALLOWED_HOSTS", default="localhost, 127.0.0.1, [::1]", cast=Csv()
)


# CSRF
CSRF_COOKIE_DOMAIN = config(
    "DJANGO_CSRF_COOKIE_DOMAIN",
    default=".localhost",
    cast=str,
)
CSRF_TRUSTED_ORIGINS = config(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    default="http://localhost:5173, http://localhost:8000",
    cast=Csv(),
)
CSRF_COOKIE_HTTPONLY = False

# CORS
CORS_ALLOWED_ORIGINS = config(
    "DJANGO_CORS_ALLOWED_ORIGINS", default="http://localhost:5173", cast=Csv()
)
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = list(default_headers)
CORS_ALLOW_METHODS = list(default_methods)

# Application definition

INSTALLED_APPS = [
    # Django Apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Firetrack Apps
    "firetrack.conta",
    "firetrack.fenomeno",
    "firetrack.produtos",
    "firetrack.candidatos",
    "firetrack.pares",
    # Third-party Apps
    "corsheaders",
]

# PYINSTRUMENT_PROFILE_DIR = BASE_DIR / "profiling"

MIDDLEWARE = [
    # "pyinstrument.middleware.ProfilerMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "firetrack.middleware.EnsureCsrfTokenMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "firetrack.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "firetrack.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases


DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": config("DJANGO_POSTGIS_DB", default="postgres", cast=str),
        "USER": config("DJANGO_POSTGIS_USER", default="postgres", cast=str),
        "PASSWORD": config("DJANGO_POSTGIS_PASSWORD", default="postgres", cast=str),
        "HOST": config("DJANGO_POSTGIS_HOST", default="localhost", cast=str),
        "PORT": config("DJANGO_POSTGIS_PORT", default="5432", cast=str),
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "pt-br"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_ROOT = BASE_DIR / "static"
STATIC_URL = "/static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
APPEND_SLASH = False

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "[{asctime}] {levelname} {name} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
        },
        "firetrack.stac.services": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
        "firetrack.candidatos.services": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
        "firetrack.pares.services": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}
