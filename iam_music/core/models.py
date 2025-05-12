# core/models.py
from django.db import models

class Artist(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Album(models.Model):
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    release_year = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.title} ({self.artist.name})"

class Song(models.Model):
    title = models.CharField(max_length=200)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    lyrics = models.TextField()

    def __str__(self):
        return self.title
