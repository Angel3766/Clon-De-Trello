from django.contrib import admin
from .models import Board, List, Card, Comment

@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    search_fields = ['name']

@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_filter = ['board']
    search_fields = ['name']

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_filter = ['list', 'assigned_to']
    search_fields = ['title']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_filter = ['user']
    search_fields = ['content']