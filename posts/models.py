from django.db import models
from django.utils import timezone
from profiles.models import Profile
from django.contrib.auth.models import User
from PIL import Image


class Post(models.Model):
    content = models.CharField(max_length=200, blank=False)
    post_img = models.ImageField(upload_to='posts/')
    liked = models.ManyToManyField(User, blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)

    def __str__(self):
        return f"Post of {self.author.user.username}"

    class Meta:
        ordering = ['-created']

    # def save(self, *args, **kwargs):
    #     super().save(*args, **kwargs)

    #     im = Image.open(self.post_img.path)
    #     print(im.size)
    #     if im.height > 300:
    #         newsize = (int(im.width/4), int(im.height/4))
    #         img = im.resize(newsize)
    #         img.save(self.post_img.path)

    @property
    def likes(self):
        if self.liked.count() == 1:
            return f"{self.liked.count()} like"
        return f"{self.liked.count()} likes"

    @property
    def no_of_comments(self):
        comments = Comment.objects.filter(post=self).count()
        if comments == 0:
            return ""
        elif comments == 1:
            return f"View {comments} comment"
        return f"View all {comments} comments"

    @property
    def time_diff(self):
        diff =  timezone.now() - self.created
        seconds = diff.seconds
        h = seconds//(60*60)
        m = (seconds-h*60*60)//60
        s = seconds-(h*60*60)-(m*60)
        if(diff.days):
            return f"{diff.days} days ago"
        if(h != 0):
            if(h == 1):
                return f"{m} hour ago"
            return f"{h} hours ago"
        elif(m != 0):
            if(m == 1):
                return f"{m} minute ago"
            return f"{m} minutes ago"
        else:
            return f"{s} seconds ago"




class Comment(models.Model):
    content = models.CharField(max_length=200, blank=True)
    post = models.ForeignKey(Post ,on_delete=models.CASCADE, related_name='post')
    author = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='author')
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment on {self.post}"

    class Meta:
        ordering = ['-created']

    @property
    def time_diff(self):
        diff =  timezone.now() - self.created
        seconds = diff.seconds
        h = seconds//(60*60)
        m = (seconds-h*60*60)//60
        s = seconds-(h*60*60)-(m*60)
        if(diff.days):
            return f"{diff.days} days ago"
        if(h != 0):
            if(h == 1):
                return f"{m} hour ago"
            return f"{h} hours ago"
        elif(m != 0):
            if(m == 1):
                return f"{m} minute ago"
            return f"{m} minutes ago"
        else:
            return f"{s} seconds ago"

