from rest_framework import serializers
from .models import Post, Comment
from users.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"


class PostSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    comments = CommentSerializer(
        many=True,
        read_only=True
    )

    likes_count = serializers.SerializerMethodField()

    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "user",
            "caption",
            "image",
            "comments",
            "likes_count",
            "is_liked",
            "created_at",
        ]

    def validate_image(self, image):

        if not image:
            return image

        # 10 MB limit
        if image.size > 10 * 1024 * 1024:
            raise serializers.ValidationError(
                "Image must be smaller than 10 MB."
            )

        allowed = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ]

        if image.content_type not in allowed:
            raise serializers.ValidationError(
                "Only JPG, PNG and WEBP images are allowed."
            )

        return image

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):

        request = self.context.get("request")

        if request and request.user.is_authenticated:
            return obj.likes.filter(
                id=request.user.id
            ).exists()

        return False