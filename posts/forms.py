from django import forms
from .models import Post

class NewPostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['post_img', 'content']

    def __init__(self, *args, **kwargs):
        super(forms.ModelForm, self).__init__(*args, **kwargs)

        self.fields['post_img'].widget.attrs['class'] = 'form-control mb-2'
        self.fields['content'].widget.attrs['class'] = 'form-control mb-2'
        self.fields['content'].widget.attrs['placeholder'] = 'Post Content'

