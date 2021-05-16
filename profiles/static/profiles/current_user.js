const posts = document.getElementById('posts');
const spinner = document.getElementById('spinner');
const loadMoreBtn = document.getElementById('load-more');
const endBlock = document.getElementById('end-block');
const profile = document.getElementById('profile');


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


const getPostsData = (userId) => {
    $.ajax({
        type: 'GET',
        url: `/u/${userId}/${num_posts}`,
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
            num_posts += 2;
        },
        error: function(response) {
            console.log(response)
        }
    })
}

const followUnfollowUser = () => {
    const followForm = document.querySelector('.follow-unfollow-form');
    const followBtn = document.getElementById('follow-btn');
    const followers = document.getElementById('followers');
    const uId = followForm.getAttribute('user_id');

    followForm.addEventListener('click', (e) => {
        e.preventDefault();
    
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8000/u/follow-unfollw/',
            data: {
                'user_id': uId,
                'csrfmiddlewaretoken': csrftoken,
            },
            success: function(response) {
                console.log(response)
                if(response.follow) {
                    followBtn.innerText = 'Unfollow';
                }else {
                    followBtn.innerText = 'Follow';
                }
                followers.innerText = response.followers;
            },
            error: function(response) {
                console.log(response)
            }
        })
    })
}


const getUserProfile = (userId) => {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8000/u/profile-details/${userId}/`,
        success: function(response) {
            const data = response.details;
            profile.innerHTML = `
            <div class="user-profile-image">
            <img src="${data.profile_pic}"  alt="" class="circle-img">
            </div>
            <div class="align-none user-detials mt-2 ml-2">
                <h4 class=" text-muted user-username">${data.username}</h4>
                <form class="follow-unfollow-form" user_id='${data.profile_id}'>
                    <button class="btn-outline text-muted follow-btn" id="follow-btn" >${data.is_following ? 'Unfollow' : 'Follow'}</button>
                </form>
            </div>
            <div class="user-bio  text-muted mt-2 ml-2">
                <div class="details">
                    <div>
                        <h6 class="inline">${data.posts}</h6> 
                        <h6 class="inline">Posts</h6>
                    </div>
                    <div>
                        <h6 class="inline" id="followers">${data.followers}</h6> 
                        <h6 class="inline">Followers</h6>
                    </div>
                    <div>
                        <h6 class="inline">${data.following}</h6> 
                        <h6 class="inline">Following</h6>
                    </div>
                </div>
                <div class="text-muted">
                    <p>${data.bio}</p>
                </div>
                </div>
            </div> 
            <hr>
            `
            followUnfollowUser();
        },
        error: function(response) {
            console.log(response)
        }
    })
}

const url  = window.location.href.split('/');
const userId = url[url.length - 2]



getUserProfile(userId);
getPostsData(userId);

loadMoreBtn.addEventListener('click', () => {
    spinner.classList.remove('not-visible');
    spinner.classList.add('d-flex');
    getPostsData(userId);
})



