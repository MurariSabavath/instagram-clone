const posts = document.getElementById('posts');
const spinner = document.getElementById('spinner');
const loadMoreBtn = document.getElementById('load-more');
const endBlock = document.getElementById('end-block');

let num_posts = 10;

const commentPost = () => {
    const commentForms = [...document.getElementsByClassName('comment-form')];
    commentForms.forEach(form => form.addEventListener('submit', e => {
        e.preventDefault();
        const clickId = form.getAttribute('form-comment-id');
        const commentInput = document.getElementById(`input-comment-${clickId}`);
        const commentLink = document.getElementById(`comments-${clickId}`);

        $.ajax({
            type: 'POST',
            url: '/comment/',
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickId,
                'commentData': commentInput.value,
            },
            success: function(response) {
                console.log(response);
                commentInput.value = "";
                commentLink.innerHTML = response.no_of_comments;
            },
            error: function(response) {
                console.length(response)
            }
        })
    }))
}

const getData = () => {
    $.ajax({
        type: 'GET',
        url: `/get-posts/${num_posts}`,
        success: function(response) {
            console.log(response['data']);
            const data = response['data'];
            data.forEach(el => {
                posts.innerHTML += post_list(el.id, el.user_img, el.author_id, el.img, el.liked, el.likes, el.author, el.no_of_comments, el.content, el.created)
                likeUnlikePosts();
                commentPost();
            });
            spinner.classList.add('not-visible');
            spinner.classList.remove('d-flex');
            if(num_posts >= response.length) {
                loadMoreBtn.classList.add('not-visible');
                endBlock.textContent = 'No more posts to load';
                endBlock.classList.remove('not-visible');
                endBlock.classList.add('d-block');
            }
            num_posts += 10;
        },
        error: function(response) {
            console.log(response)
        }
    })

}


getData();

loadMoreBtn.addEventListener('click', () => {
    spinner.classList.remove('not-visible');
    spinner.classList.add('d-flex');
    getData();
})

