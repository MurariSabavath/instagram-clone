from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import Profile

@receiver(post_save, sender=User)
def post_save_create_profile(sender, instance, created, *args, **kwargs):
    if created:
        Profile.objects.create(user=instance)