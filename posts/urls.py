from django.urls import path
from .views import (
    home,
    new_post,
    get_posts,
    comment_view,
    like_unlike_view,
    current_post,
    post_delete_view,
    post_update_view,
    get_post_details,
    get_post_comments
)

urlpatterns = [
    path('', home, name='home'),
    path('get-posts/<int:num_posts>', get_posts, name='get-posts'),
    path('new-post/', new_post, name='new-post'),
    path('post/<int:post_id>/', current_post, name='current-post'),
    path('post/delete/<int:pk>/', post_delete_view, name='delete-post'),
    path('post/update/<int:pk>/', post_update_view, name='update-post'),
    path('get-post-details/<int:pk>/', get_post_details, name='get-post-details'),
    path('get-post-comments/<int:pk>',
         get_post_comments, name='get-post-comments'),
    path('like-unlike/', like_unlike_view, name='like-unlike'),
    path('comment/', comment_view, name='comment'),
]
