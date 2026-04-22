# Modelos principales del sistema tipo Trello
from django.db import models
from django.contrib.auth.models import User


class Workspace(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workspaces')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (owner: {self.owner.username})"


class Board(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='boards')
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='boards', null=True, blank=True)
    color = models.CharField(max_length=20, default='#0079BF')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (workspace: {self.workspace})"


class List(models.Model):
    name = models.CharField(max_length=100)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='lists')
    position = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} (board: {self.board.name})"


class Card(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name='cards')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_cards')
    position = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} (list: {self.list.name})"


class Comment(models.Model):
    content = models.TextField()
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comentario de {self.user.username} en '{self.card.title}'"