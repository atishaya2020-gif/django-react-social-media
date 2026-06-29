from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User

from .permissions import IsProfileOwnerOrReadOnly
from .models import Profile
from .serializers import ProfileSerializer, RegisterSerializer
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
    AllowAny,
)

class ProfileViewSet(ModelViewSet):

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve",
        ]:
            return [IsAuthenticatedOrReadOnly()]

        if self.action == "follow":
            return [IsAuthenticated()]

        return [
            IsAuthenticated(),
            IsProfileOwnerOrReadOnly(),
        ]

    def get_queryset(self):
        return Profile.objects.select_related("user")

    @action(detail=True, methods=["POST"])
    def follow(self, request, pk=None):

        profile = self.get_object()
        my_profile = request.user.profile

        if profile == my_profile:
            return Response(
                {"detail": "You cannot follow yourself."},
                status=400,
            )

        if profile in my_profile.following.all():
            my_profile.following.remove(profile)
            return Response({"message": "Unfollowed"})

        my_profile.following.add(profile)
        return Response({"message": "Followed"})


class RegisterView(CreateAPIView):

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]