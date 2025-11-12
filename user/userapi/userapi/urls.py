from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('user/admin/', admin.site.urls),
    path('user/api/', include('userapp.urls')),
    
    # Swagger UI endpoints
    path('user/api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('user/api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]