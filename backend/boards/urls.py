from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    WorkspaceViewSet, BoardViewSet, ListViewSet,
    CardViewSet, CommentViewSet, UserViewSet,
    login_view, register_view, logout_view, me_view
)

router = DefaultRouter()
router.register(r'workspaces', WorkspaceViewSet, basename='workspace')
router.register(r'boards', BoardViewSet, basename='board')
router.register(r'lists', ListViewSet, basename='list')
router.register(r'cards', CardViewSet, basename='card')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Auth endpoints
    path('auth/login/', login_view, name='auth-login'),
    path('auth/register/', register_view, name='auth-register'),
    path('auth/logout/', logout_view, name='auth-logout'),
    path('auth/me/', me_view, name='auth-me'),
] + router.urls