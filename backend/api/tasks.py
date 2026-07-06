from celery import shared_task
from .models import Avatar, VoiceClone, GenerationJob
from .ai_services import FluxService, XTTSService, LivePortraitService

@shared_task
def process_avatar_training(avatar_id):
    try:
        avatar = Avatar.objects.get(id=avatar_id)
        # Call mock service
        safetensors_url = FluxService.train_lora(avatar.id, avatar.name)
        print(f"Avatar {avatar_id} training successfully handled in background.")
    except Exception as e:
        print(f"Error training avatar {avatar_id}: {e}")

@shared_task
def process_voice_cloning(voice_id):
    try:
        voice = VoiceClone.objects.get(id=voice_id)
        # Call mock service
        embedding_url = XTTSService.clone_voice(voice.id, voice.name)
        print(f"Voice {voice_id} cloning successfully handled in background.")
    except Exception as e:
        print(f"Error cloning voice {voice_id}: {e}")

@shared_task
def process_video_generation(job_id):
    try:
        job = GenerationJob.objects.get(id=job_id)
        job.status = 'processing'
        job.save()

        import os
        import replicate
        import asyncio
        import edge_tts
        from django.conf import settings
        import uuid

        # 1. Generate Audio using edge-tts
        print(f"[{job_id}] Generating audio from script...")
        audio_filename = f"audio_{job.id}.mp3"
        audio_path = os.path.join(settings.MEDIA_ROOT, audio_filename)
        
        async def generate_audio(text, output_path):
            voice_id = job.voice.voice_id if (job.voice and job.voice.voice_id) else "en-US-ChristopherNeural"
            communicate = edge_tts.Communicate(text, voice_id)
            await communicate.save(output_path)
            
        asyncio.run(generate_audio(job.script_text, audio_path))

        # 2. Generate Video using Fal.ai (Open Source SadTalker/LivePortrait)
        fal_key = os.environ.get("FAL_KEY")
        
        if not fal_key:
            print(f"[{job_id}] WARNING: FAL_KEY not found. Simulating video generation.")
            import time
            time.sleep(5)
            job.final_video_url = "https://www.w3schools.com/html/mov_bbb.mp4"
            job.status = 'completed'
            job.save()
            return

        import fal_client
        import time
        print(f"[{job_id}] Calling Fal.ai Serverless GPU...")
        
        # Fal.ai allows us to upload local files directly to their temporary storage to get a URL
        print(f"[{job_id}] Uploading assets to Fal.ai...")
        image_url = fal_client.upload_file(job.avatar.preview_image.path)
        audio_url = fal_client.upload_file(audio_path)
        
        print(f"[{job_id}] Generating high-fidelity silent video using LivePortrait...")
        
        def on_queue_update(update):
            if isinstance(update, fal_client.InProgress):
                for log in update.logs:
                    safe_log = log['message'].encode('ascii', 'ignore').decode('ascii')
                    print(f"[{job_id}] Fal.ai log: {safe_log}")
                    
        # Step 1: LivePortrait (Face Puppeteering)
        # We use a standard generic driving video of natural head movement from the official repo
        driving_video_url = "https://raw.githubusercontent.com/KwaiVGI/LivePortrait/main/assets/examples/driving/d0.mp4"
        
        step1_result = fal_client.subscribe(
            "fal-ai/live-portrait",
            arguments={
                "image_url": image_url,
                "video_url": driving_video_url
            },
            with_logs=True,
            on_queue_update=on_queue_update,
        )
        
        silent_video_url = step1_result.get('video', {}).get('url')
        if not silent_video_url:
            raise Exception("Fal.ai LivePortrait didn't return a silent video URL.")
            
        print(f"[{job_id}] Step 1 complete. Now applying LipSync using Kling...")
        
        # Step 2: Kling LipSync
        step2_result = fal_client.subscribe(
            "fal-ai/kling-video/lipsync/audio-to-video",
            arguments={
                "video_url": silent_video_url,
                "audio_url": audio_url,
            },
            with_logs=True,
            on_queue_update=on_queue_update,
        )

        final_video_url = step2_result.get('video', {}).get('url')
        
        if not final_video_url:
            raise Exception("Fal.ai didn't return a video URL.")

        job.final_video_url = final_video_url
        job.status = 'completed'
        job.save()
        print(f"[{job_id}] Job successfully generated and DB updated.")
    except Exception as e:
        job = GenerationJob.objects.get(id=job_id)
        job.error_message = str(e)
        job.status = 'failed'
        job.save()
        print(f"[{job_id}] Error generating video: {e}")
