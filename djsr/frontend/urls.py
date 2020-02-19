from django.urls import path
from django.conf.urls import url
from .views import index_view

urlpatterns = [
    path('', index_view),
    url(r'^.*/$', index_view)  # regex matches, then lets routing be handled by the frontend. Still needs a / at end.
]