from os import stat
from django.db import models
from django.contrib.auth.models import User
from PIL import Image


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile')
    image = models.ImageField(default='avatar.png', upload_to='profile_pics/')
    bio = models.CharField(max_length=200, blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Profile of {self.user.username}'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        im = Image.open(self.image.path)

        left = (im.width-im.height)/2
        right = ((im.width-im.height)/2) + im.height
        top = 0
        bottom = im.height

        im = im.crop((left, top, right, bottom))
        if im.height > 300:
            newsize = (600, 600)
            img = im.resize(newsize)
            img.save(self.image.path)


class Follower(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='user')
    followed_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='followed_by')

    def __str__(self):
        return f"{str(self.user.username)} is followed by {str(self.followed_by)}"

    @staticmethod
    def followers_count(user):
        return Follower.objects.filter(user=user).all().count()

    @staticmethod
    def following_count(followed_by):
        return Follower.objects.filter(followed_by=followed_by).all().count()

# followers = Follower.objects.filter(user=user).all().count()
#     following = Follower.objects.filter(followed_by=user).all().count()
