from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile


class UserSerializer(serializers.ModelSerializer):

    class Meta:

        model = User

        fields = [
            "id",
            "username"
        ]



class ProfileSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    followers_count = serializers.SerializerMethodField()

    following_count = serializers.SerializerMethodField()


    class Meta:

        model = Profile

        fields = [
            "id",
            "user",
            "bio",
            "profile_image",
            "followers_count",
            "following_count",
        ]

        read_only_fields = [
            "user",
            "followers_count",
            "following_count",
        ]


    def get_followers_count(self, obj):
        return obj.followers.count()


    def get_following_count(self, obj):
        return obj.following.count()
    
from django.contrib.auth.models import User


class RegisterSerializer(
    serializers.ModelSerializer
):

    password = serializers.CharField(
        write_only=True
    )


    class Meta:

        model = User

        fields = [
            "username",
            "email",
            "password"
        ]


    def create(self, validated_data):

        user = User.objects.create_user(

            username=validated_data["username"],

            email=validated_data["email"],

            password=validated_data["password"]

        )


        return user