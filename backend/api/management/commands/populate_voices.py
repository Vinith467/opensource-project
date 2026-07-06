import os
import subprocess
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.conf import settings
from api.models import VoiceClone
from django.core.files import File

class Command(BaseCommand):
    help = 'Populate default voices using edge-tts'

    def handle(self, *args, **kwargs):
        voices_to_create = [
            {"name": "Christopher (Professional)", "voice_id": "en-US-ChristopherNeural", "gender": "male", "age": "middle-aged"},
            {"name": "Aria (Friendly)", "voice_id": "en-US-AriaNeural", "gender": "female", "age": "adult"},
            {"name": "Guy (Energetic)", "voice_id": "en-US-GuyNeural", "gender": "male", "age": "young"},
            {"name": "Jenny (Casual)", "voice_id": "en-US-JennyNeural", "gender": "female", "age": "young"},
            {"name": "Ryan (British)", "voice_id": "en-GB-RyanNeural", "gender": "male", "age": "adult"},
            {"name": "Sonia (British)", "voice_id": "en-GB-SoniaNeural", "gender": "female", "age": "adult"},
        ]

        # Get or create superuser
        user = User.objects.filter(is_superuser=True).first()
        if not user:
            user = User.objects.first()
            if not user:
                self.stdout.write(self.style.ERROR('No users found in database. Create a user first.'))
                return

        # Ensure directory exists
        previews_dir = os.path.join(settings.MEDIA_ROOT, 'voice_previews')
        os.makedirs(previews_dir, exist_ok=True)

        for v in voices_to_create:
            self.stdout.write(f"Generating preview for {v['name']}...")
            
            output_filename = f"{v['voice_id']}_preview.mp3"
            output_path = os.path.join(previews_dir, output_filename)
            
            # Generate audio
            text = f"Hi there. I am {v['name'].split(' ')[0]}, and this is a preview of my voice. I can read any script you give me with high quality intonation."
            
            try:
                import sys
                subprocess.run([
                    sys.executable,
                    '-m', 'edge_tts',
                    '--voice', v['voice_id'],
                    '--text', text,
                    '--write-media', output_path
                ], check=True)
                
                # Check if voice already exists
                voice_obj = VoiceClone.objects.filter(voice_id=v['voice_id']).first()
                if not voice_obj:
                    voice_obj = VoiceClone(
                        user=user,
                        name=v['name'],
                        voice_id=v['voice_id'],
                        gender=v['gender'],
                        age_bracket=v['age'],
                        status='completed'
                    )
                else:
                    voice_obj.name = v['name']
                    voice_obj.gender = v['gender']
                    voice_obj.age_bracket = v['age']
                    
                with open(output_path, 'rb') as f:
                    voice_obj.preview_audio.save(output_filename, File(f), save=True)
                    
                self.stdout.write(self.style.SUCCESS(f"Successfully created/updated {v['name']}"))
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to generate {v['name']}: {str(e)}"))

        self.stdout.write(self.style.SUCCESS('Done populating voices.'))
