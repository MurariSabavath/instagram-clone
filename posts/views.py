from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib import messages
from profiles.models import Profile
from .models import Post, Comment
from .forms import NewPostForm


def home(request):
    if not request.user.is_authenticated:
        return redirect('login')
    posts = Post.objects.all()
    context = {
        'title': 'Home'
    }
    return render(request, 'posts/home.html', context=context)


def get_posts(request, num_posts):
    if not request.user.is_authenticated:
        return redirect('login')
    if request.is_ajax():
        visible = 10
        lower = num_posts - visible
        upper = num_posts
        posts = Post.objects.all()
        data = []
        for post in posts:
            item = {
                'id': post.id,
                'author_id': post.author.id,
                'author': post.author.user.username,
                'user_img': post.author.image.url,
                'img': post.post_img.url,
                'liked': True if request.user in post.liked.all() else False,
                'likes': post.likes,
                'content': post.content,
                'created': post.time_diff,
                'no_of_comments': post.no_of_comments
            }
            data.append(item)
        return JsonResponse({'data': data[lower:upper], 'length': Post.objects.all().count()})


def like_unlike_view(request):
    if not request.user.is_authenticated:
        return redirect('login')
    if request.is_ajax():
        pk = request.POST.get('pk')
        post = Post.objects.get(id=pk)
        if request.user in post.liked.all():
            post.liked.remove(request.user)
            liked = True
        else:
            post.liked.add(request.user)
            liked = False
        return JsonResponse({'liked': liked, 'count': post.likes})


def post_delete_view(request, pk):
    post = Post.objects.get(pk=pk)
    if(post.author == request.user.profile):
        return redirect('home')
    post.delete()
    messages.success(request, 'Your post has been deleted successfully!')
    return redirect('home')


def comment_view(request):
    if not request.user.is_authenticated:
        return redirect('login')
    if request.is_ajax():
        pk = request.POST.get('pk')
        comment_data = request.POST.get('commentData')
        post = Post.objects.get(id=pk)
        comment = Comment(content=comment_data, author=Profile.objects.get(
            user=request.user), post=post)
        comment.save()
        commented = True
        return JsonResponse({'commented': commented, 'no_of_comments': post.no_of_comments, 'user_id': request.user.id, 'user_name': request.user.username, 'profile_pic': request.user.profile.image.url, 'time': '0 seconds ago', 'comment_content': comment_data})


def new_post(request):
    if not request.user.is_authenticated:
        return redirect('login')
    if request.method == 'POST':
        form = NewPostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = Profile.objects.filter(user=request.user).first()
            post.save()
            messages.success(request, 'New Post has been posted')
            return redirect('home')
    else:
        form = NewPostForm()
    context = {
        'title': 'New Post',
        'is_form': 2,
        'form': NewPostForm()
    }
    return render(request, 'posts/new_post.html', context=context)


def current_post(request, post_id):
    post = Post.objects.get(pk=post_id)
    context = {
        'title': 'Post',
        'post': post,
        'profile_pic_url': post.author.image.url,
        'user_name': post.author.user.username,
        'post_img': post.post_img.url,
    }
    return render(request, 'posts/current_post.html', context=context)


def get_post_comments(request, pk):
    comments = Comment.objects.filter(post__id=pk).all()
    data = []
    for comment in comments:
        item = {
            'id': comment.id,
            'content': comment.content,
            'author': comment.author.user.username,
            'time': comment.time_diff,
            'author_id': comment.author.id,
            'author_profile_pic': comment.author.image.url
        }
        data.append(item)
    return JsonResponse({'data': data})


def get_post_details(request, pk):
    post = Post.objects.get(pk=pk)
    comments = Comment.objects.filter(post=post).all()
    comment_list = []
    data = {
        'id': post.id,
        'author_id': post.author.id,
        'author': post.author.user.username,
        'user_img': post.author.image.url,
        'img': post.post_img.url,
        'liked': True if request.user in post.liked.all() else False,
        'likes': post.likes,
        'content': post.content,
        'created': post.time_diff,
        'no_of_comments': post.no_of_comments,
        'is_author': post.author == request.user.profile
    }
    return JsonResponse({'data': data})


def post_update_view(request, pk):
    post = Post.objects.get(pk=pk)
    if request.method == 'POST':
        form = NewPostForm(request.POST, request.FILES, instance=post)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your post has been updated!')
            return redirect('home')
    form = NewPostForm(instance=post)
    context = {
        'title': 'Update Post',
        'is_form': 1,
        'form': form
    }
    return render(request, 'posts/new_post.html', context=context)
