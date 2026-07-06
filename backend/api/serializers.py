from rest_framework import serializers
from .models import Avatar, VoiceClone, GenerationJob, VideoDub

class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fields = '__all__'
        read_only_fields = ['id', 'user', 'status', 'created_at', 'updated_at', 'lora_model_id', 'base_image_url']

class VoiceCloneSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoiceClone
        fields = '__all__'
        read_only_fields = ['id', 'user', 'status', 'created_at', 'updated_at', 'voice_id']

class GenerationJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenerationJob
        fields = '__all__'
        read_only_fields = ['id', 'user', 'status', 'created_at', 'updated_at', 'audio_url', 'final_video_url', 'error_message']

class VideoDubSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoDub
        fields = '__all__'
        read_only_fields = ['id', 'user', 'status', 'created_at', 'updated_at', 'output_video_url', 'error_message']
