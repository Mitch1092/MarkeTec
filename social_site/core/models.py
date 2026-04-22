from django.db import models
from django.contrib.auth.models import User
from PIL import Image

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='posts/')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # 🔥 COMPRESIÓN AUTOMÁTICA
        img = Image.open(self.image.path)

        max_size = (800, 800)
        img.thumbnail(max_size)

        img.save(self.image.path, optimize=True, quality=70)

class Report(models.Model):
    reported_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported')
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reporter')
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    rating = models.IntegerField()

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/', default='default.png')    