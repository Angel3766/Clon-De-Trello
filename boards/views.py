# Vistas API para manejo de datos
from rest_framework import viewsets
from .models import Board, List, Card, Comment
from .serializers import *

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer

class ListViewSet(viewsets.ModelViewSet):
    queryset = List.objects.all()
    serializer_class = ListSerializer

class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

def get_queryset(self):
    queryset = super().get_queryset()
    list_id = self.request.query_params.get('list')

    if list_id:
        queryset = queryset.filter(list_id=list_id)

    return queryset