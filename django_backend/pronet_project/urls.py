from django.contrib import admin
from django.urls import path, include
from api.views import api_root

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='root'),
    path('api/', include('api.urls')),
]
