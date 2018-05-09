var weatherSearchArr = []; // An array of weather search results
var d = new Date();
var id = 1;
var idComment = 1;

//This function updates the posts on the page
var updatePostsFlow = function () {
    $('.weatherPosts').empty();

    for (var i = 0; i < weatherSearchArr.length; i++) {
        var fullDate = d.toLocaleTimeString() + " on " + d.toLocaleDateString();
        var idPost =weatherSearchArr[i].id;

        //add dynamic elements
        var div =$(`<div class="row shadow p-3 mb-5 bg-white rounded post" data-id ="${idPost}">
                               <div class="col-md-11"><h4>${weatherSearchArr[i].city}</h4></div>
                              <div class ="col-md-1"><i class="fa fa-trash trash"></i></div>
                              <div class="col-md-12">${weatherSearchArr[i].tempC} &#8451/ ${weatherSearchArr[i].tempF}&#8457 ${fullDate}</div>
                              </div>`)
            var commentDiv = $(`<div class="comments" data-id=${idPost}></div>`)
            var inputDiv = $(`<div class="input-group mb-3">
                                         <input type="text" class="form-control comment-text" placeholder="Comment about weather ${weatherSearchArr[i].city}" aria-label="Recipient's username" aria-describedby="basic-addon2">
                                          <div class="input-group-append">
                                               <button class="btn btn-success" type="button" >Comment</button>
                                         </div>
                                          </div>`);
        $('.weatherPosts').append(div);
        $(div).append(commentDiv);

        for (var j = 0; j < weatherSearchArr[i].comments.length; j++) {
            var idComment = weatherSearchArr[i].comments[j].id;
            var commentContent =weatherSearchArr[i].comments[j].content;
            $(commentDiv).append(`<div class ="comment" data-id="${idComment}"> ${commentContent} </div>`);
        }
        $(div).append('<br>');
        $(div).append(inputDiv);
    }
}

//This function detects index of post by id
var postIndexById = function(ind){
    for(var i in weatherSearchArr){
        if(weatherSearchArr[i].id === ind){
            return i;
        }
    }
}

//add post to flow page
$(`#search-btn`).on(`click`, function () {
    var $searchPlace = $('#search_input').val();
    var url = "http://api.openweathermap.org/data/2.5/weather?q=" + $searchPlace + "&units=metric&appid=d703871f861842b79c60988ccf3b17ec";
    $.get({
        url: url,
        success: function (data) {
            var city = data.name;
            var tempCels = data.main.temp;
            var tempFar = (tempCels * 1.8 + 32).toFixed(2);
            var post = {
                id : id++,
                city: city,
                tempC: tempCels,
                tempF: tempFar,
                comments : []
            }
            weatherSearchArr.push(post);
            updatePostsFlow();
        }
    });
});

$('.weatherChatContainer').on('click',".btn-success",function () {
    var commentContent = $(this).closest('div').siblings('.comment-text').val(); // extract the string comment
    var commentObject = { // build object of comment
        content : commentContent,
        id : idComment++
    }
    var postId = $(this).closest('.post').data().id;
    var index = postIndexById(postId);
    weatherSearchArr[index].comments.push(commentObject);
    updatePostsFlow();
})

$('.weatherChatContainer').on('click','.trash',function(){
   var $idPostDelete = $(this).closest('.post').data().id;
   var idPost = postIndexById($idPostDelete);
   weatherSearchArr.splice(idPost,1);
   updatePostsFlow();
})

// '[data-id="7"]'
// $(`.comments[data-id="${id}"]`);