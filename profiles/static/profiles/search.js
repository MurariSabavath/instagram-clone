const searchBar = document.getElementById('search-box');
const usersContainer = document.getElementById('users-container');

searchBar.addEventListener('keyup', (e) => {
    const val = e.target.value;
    if(val[0] !== " " && val.length > 0) {
        $.ajax({
            type: 'GET',
        url: `/search-users/?username=${val}`,
        success: function (response) {
            const data = response.data;
            usersContainer.innerHTML = "";
            if(data.length > 0) {
                data.forEach(el => {
                    usersContainer.innerHTML += `
                    <div class="container border border-lightgrey justify-content-md-center p-3 pb-2 mt-2">
                        <div class="card-profile p-2">
                            <div>
                                <img src="${el.profile_pic}" class="home-profile-pic" />
                            </div>
                            <div>
                                <a href="/u/profile/${el.id}/" class="text-dark">
                                    <h6 class="d-inline">${el.username}</h6>
                                </a>
                            </div>
                        </div>
                    </div>
                    `
                });
            }else {
                usersContainer.innerHTML = `
                <div class="alert alert-info mt-2" role="alert">
                    No results found!
                </div>
                `
            }
        },
        error: function (response) {
            console.log(response)
        }
    })
    }else if(val.length == 0) {
        usersContainer.innerHTML = ""
    }
})

