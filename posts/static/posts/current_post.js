const posts = document.getElementById('posts');
const spinner = document.getElementById('spinner');
const post = document.getElementById('post');
const deleteLink = document.getElementById('delete-link');

let num_posts = 10;

const createComment = ( author_id, author, author_profile_pic, time, content ) => {
    return `
        <div class="container border border-lightgrey justify-content-md-center p-1 pb-2 mt-2">
            <div class="card-profile p-1">
                <div class="pt-2">
                    <img src="${author_profile_pic}" class="home-profile-pic" />
                </div>
                <div class="mt-0">
                    <a href="/u/profile/${author_id}/" class="text-dark">
                        <h6 class="d-inline">${author}</h6>
                    </a>
                    <span class="text-muted">${time}</span>
                    <p class="mb-0">${content}</p>
                </div>
            </div>
        </div>
    `
}

const postCommentsLoad = () => {
    $.ajax({
        type:'GET',
        url: `/get-post-comments/${postID}`,
        success: function(response) {   
            const data = response.data;
            console.log(data)
            data.forEach((el) => {
                post.innerHTML += createComment( author_id=el.author_id, author=el.author, author_profile_pic=el.author_profile_pic, time=el.time, content=el.content)
            })
            spinner.classList.add('not-visible');
            spinner.classList.remove('d-flex');
        },
        error: function(response) {
            console.log(response)
        }
    })
}

const commentPost = () => {
    const commentForms = [...document.getElementsByClassName('comment-form')];
    commentForms.forEach(form => form.addEventListener('submit', e => {
        e.preventDefault();
        const clickId = form.getAttribute('form-comment-id');
        const commentInput = document.getElementById(`input-comment-${clickId}`);
        const commentLink = document.getElementById(`comments-${clickId}`)

        $.ajax({
            type: 'POST',
            url: '/comment/',
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickId,
                'commentData': commentInput.value,
            },
            success: function(response) {
                commentInput.value = "";
                console.log(response)
                commentLink.innerHTML = response.no_of_comments;
                $("#post").prepend(createComment(author_id=response.user_id, author=response.user_name, author_profile_pic=response.profile_pic, time=response.time, content=response.comment_content));
            },
            error: function(response) {
                console.length(response)
            }
        })
    }))
}

const getData = (postID) => {
    $.ajax({
        type: 'GET',
        url: `/get-post-details/${postID}`,
        success: function(response) {
            const data = response['data'];
            console.log(data);
            deleteLink.href = `/post/delete/${data.id}/`;
            posts.innerHTML += post_list(data.id, data.user_img, data.author_id, data.img, data.liked, data.likes, data.author, data.no_of_comments, data.content, data.created);
                likeUnlikePosts();
                commentPost();
                postCommentsLoad();
        },
        error: function(response) {
            console.log(response)
        }
    })

}

const url  = window.location.href.split('/');
const postID = url[url.length - 2]
getData(postID);
