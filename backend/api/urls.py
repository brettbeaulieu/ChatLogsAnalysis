from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ChatFileViewSet,
    MessageViewSet,
    EmoteSetViewSet,
    EmoteViewSet,
    ChannelViewSet,
    RustlogViewSet,
)

router = DefaultRouter()
router.register(r"logfiles", ChatFileViewSet)
router.register(r"chat/messages", MessageViewSet)
router.register(r"emotesets", EmoteSetViewSet)
router.register(r"chat/emotes", EmoteViewSet)
router.register(r"channels", ChannelViewSet)
router.register(r"rustlog", RustlogViewSet, basename="rustlog")

urlpatterns = [
    path("", include(router.urls)),
]
