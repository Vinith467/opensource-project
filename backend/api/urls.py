from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AvatarViewSet, VoiceCloneViewSet, GenerationJobViewSet, VideoDubViewSet

router = DefaultRouter()
router.register(r'avatars', AvatarViewSet, basename='avatar')
router.register(r'voices', VoiceCloneViewSet, basename='voiceclone')
router.register(r'jobs', GenerationJobViewSet, basename='generationjob')
router.register(r'dubs', VideoDubViewSet, basename='videodub')

urlpatterns = [
    path('', include(router.urls)),
]
