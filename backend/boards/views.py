# Vistas API para manejo de datos
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from .models import Workspace, Board, List, Card, Comment
from .serializers import (
    WorkspaceSerializer, BoardSerializer, ListSerializer,
    CardSerializer, CommentSerializer, UserSerializer
)


# ──────────────────────────────────────────────
# Auth endpoints
# ──────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': {'id': user.id, 'username': user.username, 'email': user.email}
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email', '')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'username y password son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'El usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': {'id': user.id, 'username': user.username, 'email': user.email}
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    return Response({'id': user.id, 'username': user.username, 'email': user.email})


# ──────────────────────────────────────────────
# ViewSets
# ──────────────────────────────────────────────

class WorkspaceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Workspace.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Board.objects.filter(owner=self.request.user)
        workspace_id = self.request.query_params.get('workspace')
        if workspace_id:
            queryset = queryset.filter(workspace_id=workspace_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ListViewSet(viewsets.ModelViewSet):
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = List.objects.filter(board__owner=self.request.user)
        board_id = self.request.query_params.get('board')
        if board_id:
            queryset = queryset.filter(board_id=board_id)
        return queryset


class CardViewSet(viewsets.ModelViewSet):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Card.objects.filter(list__board__owner=self.request.user)
        list_id = self.request.query_params.get('list')
        if list_id:
            queryset = queryset.filter(list_id=list_id)
        return queryset


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Comment.objects.filter(card__list__board__owner=self.request.user)
        card_id = self.request.query_params.get('card')
        if card_id:
            queryset = queryset.filter(card_id=card_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ──────────────────────────────────────────────
# UserViewSet — SOLO LECTURA (requisito del proyecto)
# ──────────────────────────────────────────────

class UserViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    """
    Solo permite GET /api/users/ y GET /api/users/{id}/
    No permite POST, PUT, PATCH ni DELETE.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]