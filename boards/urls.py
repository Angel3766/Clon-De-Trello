from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'boards', BoardViewSet)
router.register(r'lists', ListViewSet)
router.register(r'cards', CardViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = router.urls