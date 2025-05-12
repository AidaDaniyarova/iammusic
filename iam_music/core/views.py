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

HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/t5-base"
headers = {
    "Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}"
}

def generate_annotation(request):
    song_line = request.GET.get('song_line')
    if not song_line:
        return JsonResponse({'error': 'No song line provided'}, status=400)

    payload = {
        "inputs": f"Explain the meaning behind this song lyric: {song_line}",
    }

    try:
        response = requests.post(HUGGINGFACE_API_URL, headers=headers, json=payload)
        response_data = response.json()
        annotation = response_data.get('generated_text', 'Sorry, could not generate annotation.')
        return JsonResponse({'annotation': annotation})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)