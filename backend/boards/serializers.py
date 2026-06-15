# Serializadores para conversión a JSON
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Workspace, Board, List, Card, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        read_only_fields = ['id', 'username', 'email']


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'content', 'card', 'user', 'created_at']
        read_only_fields = ['id', 'created_at', 'user']


class CardSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='assigned_to', write_only=True, allow_null=True, required=False
    )

    class Meta:
        model = Card
        fields = ['id', 'title', 'description', 'list', 'assigned_to', 'assigned_to_id', 'position', 'created_at', 'comments']
        read_only_fields = ['id', 'created_at']


class ListSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = List
        fields = ['id', 'name', 'board', 'position', 'cards']
        read_only_fields = ['id']


class BoardSerializer(serializers.ModelSerializer):
    lists = ListSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ['id', 'name', 'owner', 'workspace', 'color', 'created_at', 'lists']
        read_only_fields = ['id', 'created_at', 'owner']


class BoardSummarySerializer(serializers.ModelSerializer):
    """Serializer ligero para listar boards dentro de un workspace."""
    class Meta:
        model = Board
        fields = ['id', 'name', 'color']


class WorkspaceSerializer(serializers.ModelSerializer):
    boards = BoardSummarySerializer(many=True, read_only=True)

    class Meta:
        model = Workspace
        fields = ['id', 'name', 'owner', 'created_at', 'boards']
        read_only_fields = ['id', 'created_at', 'owner']