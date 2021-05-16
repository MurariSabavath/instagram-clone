from django.contrib import admin
from .models import Post, Comment

admin.site.register(Comment)
admin.site.register(Post)