from django.urls import path
from .views import ArtistList, AlbumList, SongList, SongDetail
from . import views

urlpatterns = [
    path('artists/', ArtistList.as_view(), name='artist-list'),
    path('albums/', AlbumList.as_view(), name='album-list'),
    path('songs/', SongList.as_view(), name='song-list'),
    path('songs/<int:pk>/', SongDetail.as_view(), name='song-detail'),
path('generate_annotation/', views.generate_annotation, name='generate_annotation'),
]
