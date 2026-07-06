from rest_framework import viewsets, permissions
from .models import Avatar, VoiceClone, GenerationJob, VideoDub
from .serializers import AvatarSerializer, VoiceCloneSerializer, GenerationJobSerializer, VideoDubSerializer

class AvatarViewSet(viewsets.ModelViewSet):
    serializer_class = AvatarSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Avatar.objects.all()

    def perform_create(self, serializer):
        from django.contrib.auth.models import User
        user, _ = User.objects.get_or_create(username="testuser")
        avatar = serializer.save(user=user)
        
        # If no preview image but there is training data, extract the first image
        if not avatar.preview_image and avatar.training_data:
            import zipfile
            from django.core.files.base import ContentFile
            import os
            
            try:
                with zipfile.ZipFile(avatar.training_data.path, 'r') as z:
                    # Find the first image file
                    image_files = [f for f in z.namelist() if f.lower().endswith(('.png', '.jpg', '.jpeg')) and not f.startswith('__MACOSX') and not f.startswith('.')]
                    if image_files:
                        first_image = image_files[0]
                        image_data = z.read(first_image)
                        filename = os.path.basename(first_image)
                        avatar.preview_image.save(filename, ContentFile(image_data), save=True)
            except Exception as e:
                print(f"Error extracting image from zip: {e}")

        from .tasks import process_avatar_training
        process_avatar_training.delay(avatar.id)

class VoiceCloneViewSet(viewsets.ModelViewSet):
    serializer_class = VoiceCloneSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return VoiceClone.objects.all()

    def perform_create(self, serializer):
        from django.contrib.auth.models import User
        user, _ = User.objects.get_or_create(username="testuser")
        voice = serializer.save(user=user)
        from .tasks import process_voice_cloning
        process_voice_cloning.delay(voice.id)

class GenerationJobViewSet(viewsets.ModelViewSet):
    serializer_class = GenerationJobSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return GenerationJob.objects.all()

    def perform_create(self, serializer):
        from django.contrib.auth.models import User
        user, _ = User.objects.get_or_create(username="testuser")
        job = serializer.save(user=user)
        from .tasks import process_video_generation
        process_video_generation.delay(job.id)

class VideoDubViewSet(viewsets.ModelViewSet):
    serializer_class = VideoDubSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return VideoDub.objects.all()

    def perform_create(self, serializer):
        from django.contrib.auth.models import User
        user, _ = User.objects.get_or_create(username="testuser")
        dub = serializer.save(user=user)
        # Mock task logic for now
        # from .tasks import process_video_dubbing
        # process_video_dubbing.delay(dub.id)
