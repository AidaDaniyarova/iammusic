# core/views.py
from rest_framework import generics
from .models import Artist, Album, Song
from .serializers import ArtistSerializer, AlbumSerializer, SongSerializer
from rest_framework.filters import SearchFilter
import requests
from django.http import JsonResponse
from iam_music import settings


class ArtistList(generics.ListAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name']

class AlbumList(generics.ListAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title', 'artist__name']

class SongList(generics.ListAPIView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title', 'album__title', 'album__artist__name']

class SongDetail(generics.RetrieveAPIView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer

API_URL = "https://router.huggingface.co/cohere/compatibility/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}"
}

import json
import re

def generate_annotation(request):
    song_line = request.GET.get('song_line')
    song_id = request.GET.get('song_id')
    task = request.GET.get('task', 'analysis')  # default

    if not song_line:
        return JsonResponse({'error': 'No song line provided'}, status=400)

    # Collect metadata
    song_info = ""
    if song_id:
        try:
            song = Song.objects.select_related('album__artist').get(id=song_id)
            song_info = f"Song: {song.title}, Artist: {song.album.artist.name}, Album: {song.album.title}"
        except Song.DoesNotExist:
            pass

    task_prompts = {
        "summary": """
        Summarize the meaning of this lyric in 1-2 sentences.
        Return JSON with:
        {"summary": "..."}
        """,
        "mood": """
        Analyze only the emotional tone of this lyric.
        Return JSON with:
        {"emotional_tone": "...", "mood_description": "..."}
        """,
        "analysis": """
        Provide a general analysis of this lyric.
        Return JSON with:
        {"literal_meaning": "...", "emotional_tone": "...", "theme_connection": "...", "alternative_interpretations": ["...", "..."]}
        """,
        "deep_analysis": """
        Provide a deep analysis of this lyric.
        Return JSON with:
        {"literal_meaning": "...", "emotional_tone": "...", "cultural_reference": "...", "theme_connection": "...", "alternative_interpretations": ["...", "..."]}
        """
    }

    prompt = task_prompts.get(task, task_prompts["analysis"])

    payload = {
        "messages": [
            {"role": "system", "content": "You are a music expert. Reply ONLY with valid JSON."},
            {"role": "user", "content": f"Lyric: {song_line}\n{song_info}\nTask: {task}\n{prompt}"}
        ],
        "max_tokens": 512,
        "model": "command-a-03-2025"
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        response_data = response.json()

        raw_content = response_data.get("choices", [{}])[0].get("message", {}).get("content", "")

        if not raw_content:
            return JsonResponse({'error': 'Empty AI response'}, status=500)

        # 🧹 Clean model output (remove markdown fences or extra text)
        raw_content = raw_content.strip()
        raw_content = re.sub(r"^```json|```$", "", raw_content).strip()

        try:
            annotation = json.loads(raw_content)
        except json.JSONDecodeError:
            # fallback if AI returned non-JSON
            annotation = {"raw_output": raw_content}

        return JsonResponse({
            'task': task,
            'annotation': annotation
        })

    except Exception as e:
        return JsonResponse({'error': f'AI processing failed: {str(e)}'}, status=500)
