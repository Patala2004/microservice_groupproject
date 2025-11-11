from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

router.register(r'users', views.UserViewSet)
router.register(r'campus', views.CampusViewSet)

urlpatterns = router.urls
