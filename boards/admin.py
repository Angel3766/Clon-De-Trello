from django.contrib import admin
from .models import Workspace, Board, List, Card, Comment


@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'owner', 'created_at']
    search_fields = ['name', 'owner__username']
    list_filter = ['created_at']


@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'owner', 'workspace', 'color', 'created_at']
    search_fields = ['name', 'owner__username']
    list_filter = ['workspace', 'created_at']


@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'board', 'position']
    search_fields = ['name', 'board__name']
    list_filter = ['board']


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'list', 'assigned_to', 'position', 'created_at']
    search_fields = ['title', 'description']
    list_filter = ['list', 'assigned_to', 'created_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'card', 'created_at']
    search_fields = ['content', 'user__username', 'card__title']
    list_filter = ['user', 'created_at']