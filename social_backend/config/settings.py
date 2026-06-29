"""
Django settings for config project.
"""

from pathlib import Path
from datetime import timedelta
import os

from dotenv import load_dotenv
import dj_database_url

# -------------------------------------------------
# Base Directory
# -------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

# -------------------------------------------------
# Security
# -------------------------------------------------

SECRET_KEY = os.getenv("SECRET_KEY")

DEBUG = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
]

# -------------------------------------------------
# Installed Apps
# -------------------------------------------------

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "corsheaders",

    "rest_framework",

    "django_filters",
    "cloudinary",
    "cloudinary_storage",

    "users.apps.UsersConfig",

    "posts",
]

# -------------------------------------------------
# Middleware
# -------------------------------------------------

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",

    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# -------------------------------------------------
# URLs
# -------------------------------------------------

ROOT_URLCONF = "config.urls"

# -------------------------------------------------
# Templates
# -------------------------------------------------

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",

                "django.contrib.auth.context_processors.auth",

                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# -------------------------------------------------
# WSGI
# -------------------------------------------------

WSGI_APPLICATION = "config.wsgi.application"

# -------------------------------------------------
# Database (Neon PostgreSQL)
# -------------------------------------------------

DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL")
    )
}

# -------------------------------------------------
# Password Validators
# -------------------------------------------------

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

# -------------------------------------------------
# Internationalization
# -------------------------------------------------

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# -------------------------------------------------
# Static Files
# -------------------------------------------------

STATIC_URL = "static/"

STATIC_ROOT = BASE_DIR / "staticfiles"

# -------------------------------------------------
# Media Files
# (Temporary until Cloudinary)
# -------------------------------------------------



# -------------------------------------------------
# REST Framework
# -------------------------------------------------

REST_FRAMEWORK = {

    "DEFAULT_AUTHENTICATION_CLASSES": (

        "rest_framework_simplejwt.authentication.JWTAuthentication",

    ),

    "DEFAULT_PERMISSION_CLASSES": (

        "rest_framework.permissions.IsAuthenticated",

    ),

    "DEFAULT_FILTER_BACKENDS": (

        "django_filters.rest_framework.DjangoFilterBackend",

        "rest_framework.filters.SearchFilter",

        "rest_framework.filters.OrderingFilter",

    ),
}

# -------------------------------------------------
# JWT
# -------------------------------------------------

SIMPLE_JWT = {

    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),

    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),

}

# -------------------------------------------------
# CORS
# -------------------------------------------------

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

# -------------------------------------------------
# Default Auto Field
# -------------------------------------------------

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


import cloudinary

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}