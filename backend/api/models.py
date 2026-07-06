from django.db import models
from django.contrib.auth.models import User
import uuid

class Avatar(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='avatars')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    # The path or ID of the trained LoRA model
    lora_model_id = models.CharField(max_length=255, blank=True, null=True)
    # The generated base image for the avatar
    base_image_url = models.URLField(max_length=1024, blank=True, null=True)
    # The image uploaded by the user to represent this avatar in the UI
    preview_image = models.ImageField(upload_to='avatars/', blank=True, null=True)
    # The optional zip file of training images for fine-tuning a Studio Avatar
    training_data = models.FileField(upload_to='avatars/training/', blank=True, null=True)
    
    ASPECT_RATIO_CHOICES = [
        ('16:9', '16:9 (Landscape)'),
        ('9:16', '9:16 (Portrait)'),
        ('1:1', '1:1 (Square)'),
    ]
    aspect_ratio = models.CharField(max_length=10, choices=ASPECT_RATIO_CHOICES, default='16:9')
    
    status_choices = [
        ('pending', 'Pending'),
        ('training', 'Training'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    status = models.CharField(max_length=20, choices=status_choices, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class VoiceClone(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='voices')
    name = models.CharField(max_length=255)
    # The ID returned by XTTS-v2 or the path to the reference audio
    voice_id = models.CharField(max_length=255, blank=True, null=True)
    reference_audio_url = models.URLField(max_length=1024, blank=True, null=True)
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('neutral', 'Neutral'),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='neutral')
    age_bracket = models.CharField(max_length=20, default='adult', help_text="e.g. 'young', 'adult', 'middle-aged'")
    preview_audio = models.FileField(upload_to='voice_previews/', null=True, blank=True)
    
    status_choices = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    status = models.CharField(max_length=20, choices=status_choices, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class GenerationJob(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    avatar = models.ForeignKey(Avatar, on_delete=models.SET_NULL, null=True, related_name='jobs')
    voice = models.ForeignKey(VoiceClone, on_delete=models.SET_NULL, null=True, related_name='jobs')
    
    script_text = models.TextField()
    quality = models.CharField(max_length=20, default='1080p')
    
    # URLs for the generated assets
    audio_url = models.URLField(max_length=1024, blank=True, null=True)
    final_video_url = models.URLField(max_length=1024, blank=True, null=True)
    
    status_choices = [
        ('pending', 'Pending'),
        ('generating_audio', 'Generating Audio'),
        ('generating_video', 'Generating Video'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    status = models.CharField(max_length=20, choices=status_choices, default='pending')
    error_message = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Job {self.id} - {self.status}"


class VideoDub(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='video_dubs')
    source_video = models.FileField(upload_to='dubs/source/')
    target_language = models.CharField(max_length=50)
    
    # Optional: if they pick an existing voice, otherwise they upload reference audio
    voice_clone = models.ForeignKey(VoiceClone, on_delete=models.SET_NULL, null=True, blank=True, related_name='video_dubs')
    reference_audio = models.FileField(upload_to='dubs/reference_audio/', blank=True, null=True)
    
    output_video_url = models.URLField(max_length=1024, blank=True, null=True)
    
    status_choices = [
        ('pending', 'Pending'),
        ('extracting_audio', 'Extracting Audio'),
        ('translating', 'Translating & Dubbing'),
        ('lip_syncing', 'Lip Syncing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    status = models.CharField(max_length=20, choices=status_choices, default='pending')
    error_message = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dub Job {self.id} - {self.status}"
