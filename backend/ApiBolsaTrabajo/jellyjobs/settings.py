from pathlib import Path
from datetime import timedelta
import os

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "valenxity@gmail.com"  # Tu correo de Gmail
EMAIL_HOST_PASSWORD = "gtid gsck exqq jpfc"  # La contraseña de aplicación que Google te dio
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER  # Dirección predeterminada de "from"


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = 'django-insecure-g_5as3h&^(qq58yo7c!1(yjg$&nwhf4)vf8bfk=^nh$e2odohe'
DEBUG = True

ALLOWED_HOSTS = []

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # o el puerto en el que corre tu frontend
]
CORS_ALLOW_CREDENTIALS = True  # Permitir cookies con credenciales


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'jellyjobs',
    'app',
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = 'jellyjobs.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'jellyjobs.wsgi.application'

SESSION_COOKIE_SAMESITE = "None"  # Permite compartir entre sitios
SESSION_COOKIE_SECURE = False  # ❌ No requiere HTTPS en desarrollo
CSRF_COOKIE_SAMESITE = "None"  # Para CSRF en cookies
CSRF_COOKIE_SECURE = False  # ❌ No requiere HTTPS en desarrollo

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': f"{BASE_DIR}/JellyJobs.db",
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'USER_ID_FIELD': 'idadmin',
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    'AUTH_COOKIE': 'access_token',  # Nombre de la cookie para el JWT
    'REFRESH_TOKEN_COOKIE': 'refresh_token',
    'AUTH_COOKIE_SECURE': False,  # ❌ No requiere HTTPS en desarrollo
    'AUTH_COOKIE_PATH': '/',  # 🔄 Disponible en toda la aplicación
    'AUTH_COOKIE_SAMESITE': 'None',  # ⚠️ Permite compartir entre sitios
    'REFRESH_TOKEN_COOKIE_PATH': '/',  # 🔄 Disponible en toda la aplicación para el refresh token
    'REFRESH_TOKEN_COOKIE_SAMESITE': 'None',
}

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'app.authentication_backend.AdminEmailBackend',
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/


STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'build', 'static'),
]

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')




# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
