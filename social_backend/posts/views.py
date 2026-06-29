from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .permissions import IsOwnerOrReadOnly
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer


from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)

class PostViewSet(ModelViewSet):

    queryset = Post.objects.all().order_by("-created_at")

    serializer_class = PostSerializer

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "user",
    ]

    search_fields = [
        "caption",
        "user__username",
    ]

    ordering_fields = [
        "created_at",
    ]

    ordering = [
        "-created_at",
    ]

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve",
        ]:
            return [IsAuthenticatedOrReadOnly()]

        if self.action == "like":
            return [IsAuthenticated()]

        return [
            IsAuthenticated(),
            IsOwnerOrReadOnly(),
        ]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["POST"])
    def like(self, request, pk=None):

        post = self.get_object()

        if request.user in post.likes.all():
            post.likes.remove(request.user)
            return Response({"message": "Post unliked"})

        post.likes.add(request.user)
        return Response({"message": "Post liked"})


class CommentViewSet(ModelViewSet):

    queryset = Comment.objects.all().order_by("-created_at")

    serializer_class = CommentSerializer

    permission_classes = [
        IsAuthenticated,
        IsOwnerOrReadOnly,
    ]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)