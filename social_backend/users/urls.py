from rest_framework.routers import DefaultRouter



from .views import (
    ProfileViewSet,
    RegisterView
)

from django.urls import path

router = DefaultRouter()


router.register(
    "profiles",
    ProfileViewSet
)


urlpatterns = [

    path(
        "register/",
        RegisterView.as_view()
    )

]


urlpatterns += router.urls