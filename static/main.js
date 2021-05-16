const alertBox = document.getElementsByClassName('alert');

setTimeout(() => {
    [...alertBox].forEach(el => {
        el.classList.add('not-visible')
    });
}, 4000)

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-form')];
    likeUnlikeForms.forEach(form => form.addEventListener('click', e => {
        e.preventDefault();
        const clickId = form.getAttribute('form-like-id');
        const clickedBtn = document.getElementById(`like-unlike-${clickId}`);

        $.ajax({
            type: 'POST',
            url: '/like-unlike/',
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickId
            },
            success: function(response) {
                console.log(response);
                document.getElementById(`likes-${clickId}`).textContent = response.count;
                document.getElementById(`likes-${clickId}`).textContent = response.count;
                if(response.liked) {
                    clickedBtn.innerHTML = 'like';
                }else {
                    clickedBtn.innerHTML = 'unlike';
                }
            },
            error: function(response) {
                console.log(response)
            }
        })
    }))
}

const post_list = (id, user_img, author_id, img, liked, likes, author, no_of_comments, content, created) => {
    return `
        <div class="card">
            <div class="card-profile p-2">
                <div>
                    <img src="${user_img}" class="home-profile-pic" />
                </div>
                <div>
                    <a href="/u/profile/${author_id}/" class="text-dark">
                        <h6 class="d-inline">${author}</h6>
                    </a>
                </div>
            </div>
            <a href="/post/${id}">
                <img class="card-img-top" src="${img}" alt="Card image cap"/>
            </a>
            <div class="card-body">
                <div className="btns">
                    <form class="d-inline like-unlike-form" form-like-id=${id}>
                        <button class="border-0 pl-2 pr-2 btn btn-primary" id="like-unlike-${id}" >${liked ? "unlike":"like"}</button>
                    </form>
                </div>
                <p class="text-muted mb-1 mt-1 text-bold" id="likes-${id}">${likes}</p>
                <a href="" class="text-dark">
                        <h6 class="d-inline">${author}</h6>
                </a>
                <p class="d-inline">${content}</p>
                <p class="text-muted mb-1">${created}</p>
                <a href="/post/${id}" class="text-dark" id="comments-${id}">${no_of_comments ? no_of_comments : "" }</a>
                <form class="comment-form" form-comment-id=${id}>
                    <input type="text" id="input-comment-${id}" class="form-control" placeholder="Comment" required/>
                    <button type="submit" class="btn btn-primary mt-2 w-100">Comment</button>
                </form>
            </div>
        </div>
        `
}


