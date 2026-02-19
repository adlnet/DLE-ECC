from django.urls import path
from key_auth import views
from knox.views import LogoutAllView, LogoutView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

app_name = 'key_auth'

urlpatterns = [
    path('generate-key/',
         views.GenerateAPIKeyFromOtherAuthMethod.as_view(), name='gen-key'),
    path('delete-key/', LogoutView.as_view(), name='delete-key'),
    path('delete-all-keys/', LogoutAllView.as_view(),
         name='delete-all-keys'),
]
