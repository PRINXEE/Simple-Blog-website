var validImagetypes = ["image/gif","image/jpeg","image/png","image/jpg"];

$("#selected-image").hide();
function previewImage(image_blog){
   if(image_blog.files && image_blog.files[0]){
       var reader = new FileReader();

    reader.onload = function(e){
       $("#selected-image").attr('src', e.target.result);
       $("#selected-image").fadeIn();
    }
    reader.readAsDataURL(image_blog.files[0]);
   }
}
$("#main-image").change(function(){
    previewImage(this);blogs
});

$("#save-blog").click(function() {
    $("#main-desc").removeClass("is-invalid");
    $("#main-image").removeClass("is-invalid");

    var desc = $("#main-desc").val();
    var picture = $("#main-image").prop("files")[0];

    if (!desc){

        $("#main-desc").addClass("is-invalid");
        return;
    }

    if (picture == null){

        $("#main-image").addClass("is-invalid");
        return;
    }

    if($.inArray(picture["type"], validImagetypes)<0){

        $("#main-image").addClass("is-invalid");
        return;
    }

    //**************************************uploading and save to database starts********************************************//

    var databaseRef = firebase.database().ref().child("Blogs");

    databaseRef.once("value").then(function(snapshot){
        var name = picture["name"];
        var dateStr = new Date().getTime();
        var fileCompleteName = name + "_" + dateStr;

        var storageRef = firebase.storage().ref("Blog Images");
        var blogStorageRef = storageRef.child(fileCompleteName);

        var uploadTask = blogStorageRef.put(picture);

        uploadTask.on("state_changed",

            function progress(snapshot) {

            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    
            $("#upload-progress").html(Math.round(percentage) + "%");
            $("#upload-progress").attr("style", "width" + percentage + "%"); 

            },

            function error(err) {
                
            },
            function complete(){

                var user = firebase.auth().currentUser;
                var userName;

                firebase.database().ref("Users/" + user.uid).once("value").then(function(snapshot){
                    var fName = (snapshot.val() && snapshot.val().firstName);
                    var sName = (snapshot.val() && snapshot.val().secondName);

                    userName = fName + "" + sName;

                });

                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadUrl){
                    var time = new Date();

                    var options = {
                        weekday:"long",
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                    };

                    var blogData = {
                        "image": downloadUrl,
                        "name" : fileCompleteName,
                        "desc" : desc,
                        "uid" : user.uid,
                        "counter": 500 - counter,
                        "userName" : userName,
                        "time" : time.toLocaleString("en-US", {hour: "numeric", minute: "numeric", hour12: true}),
                        "date": time.toLocaleDateString("en-US", options),

                    };

                    var newPostRef = databaseRef.push();

                    newPostRef.set(blogData, function(err){
                        if(err){
                            $("#result").attr("class", "alert alert-danger");
                            $("#result").html(err.message);
                        }
                        else{
                            $("#result").attr("class", "alert alert-success");
                            $("#result").html("Blog has been uploaded successfuly");

                            window.open("", "_self");
                        }
                        resetForm();
                    });
                });
            }
    
        );
    })

 });

 function resetForm(){
    $("#main-form")[0].reset();
    $("#selected-image").fadeOut();
    $("#upload-progress").html("completed");
 
  }

  //**************************************uploading and save to database ends********************************************//

//**************************************Retrive and Display Data form database starts********************************************//

  var dbBlogs = firebase.database().ref( ).child("Blogs").orderByChild("counter");

  dbBlogs.on("value", function(blogs){
      
    if(blogs.exists()){

        var blogsHtml = "";

        blogs.forEach(function(singleBlog){

            counter = counter + 1;
 
            blogsHtml += "<div class = 'jumbotron bg-light text-dark border-dark'>"
            
                blogsHtml += "<div> <img width= '1000px' height= '450px' src= '";
                    blogsHtml += singleBlog.val().image;
                blogsHtml += "'> </div> <br>";

                blogsHtml += "<div class='row'>";
                blogsHtml += "<div class='col-sm-5'> <p style='color:grey'>"
                                + "Published by:"+ " " + singleBlog.val().userName
                                + "</p> </div>" +

                                "<div class='col-sm-4'> <p style='color:grey';>"
                                + "Time:" + singleBlog.val().time
                                + "</p> </div>" +

                                "<div class='col-sm-3'> <p style='color:grey'>"
                                + "Date:"+ " " + singleBlog.val().date
                                + "</p> </div>"
                                ;

            blogsHtml += "</div> <br>";

                blogsHtml += "<div style='text-align: justify; color: black;'>";
                    blogsHtml += singleBlog.val().desc;
                blogsHtml += "</div> <br>";

            blogsHtml += "</div>";
        });
        $("#blogs").html(blogsHtml);
    }
  });

//**************************************Retrive and Display Data form database ends********************************************//


/*function deleteblogRecord(key) {
    var deleteRef = firebase.database().ref().child("Blog").child(key);

    return deleteRef.remove()
    .then(function () {
       console.log ("Removed successfully");
    })
    .catch(function () {
        console.log ("Error Occured");
    });
}
*/

 