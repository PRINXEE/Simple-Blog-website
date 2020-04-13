const firebaseConfig = {
    apiKey: "AIzaSyAIaLrcU2zzEryw3pQlBiHalzKF0wWmI0Q",
    authDomain: "awesome-33ed3.firebaseapp.com",
    databaseURL: "https://awesome-33ed3.firebaseio.com",
    projectId: "awesome-33ed3",
    storageBucket: "awesome-33ed3.appspot.com",
    messagingSenderId: "961928803549",
    appId: "1:961928803549:web:b8e444ea5de0db31829734",
    measurementId: "G-X8EC30X3RN"
  }; 
    // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
    console.log("firebase loaded");

    firebase.auth.Auth.Persistence.LOCAL;

////////// sign in node js code //////
$("#btn-signin").click(function(){
    var email = $("#email").val();
    var password = $("#password").val();

    if(email !="" && password !=""){
        var result = firebase.auth().signInWithEmailAndPassword(email,password);

        result.catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            window.alert("message : " + errorMessage);
        });
    }
    else{
      window.alert("form is incomplete. please fill out all fields.");
    }
});

////// end of sign in node js code ///////

//// logpout  node js code ////

$("#btn-logout").click(function(){
  firebase.auth().signOut();
});

////// end of logout node js code ///////

///////// sign up node js code/////////
$("#btn-signup").click(function(){

  var email = $("#email").val();
  var password = $("#password").val();
  var cpassword = $("#confirmPassword").val();

  if(email !="" && password !="" && cpassword != ""){
    
      if(password == cpassword){
          var result = firebase.auth().createUserWithEmailAndPassword(email,password);

        result.catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            window.alert("message : " + errorMessage);
        });

      }
      else{
        window.alert("Password do not match with the confirm password")
      }
  }
  else{
    window.alert("form is incomplete. please fill out all fields.");
  }
});
////// end of Sign up node js code ///////


///// forgetpassword node js code/////

$("#btn-resetPassword").click(function(){
  var  auth = firebase.auth();
  var email = $("#email").val();

  if (email != ""){
     auth.sendPasswordResetEmail(email).then(function(){

      window.alert("Email has been sent to you, Please check and confirm")
      
     }).catch(function(error){

      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorCode);
      console.log(errorMessage);

      window.alert("message : " + errorMessage);
     });
  }
  else{
    window.alert("Please write your email address");
  }
}); 

////// end of forgetpassword node js code ///////


$("#btn-update").click(function(){

  var phone = $("#phone").val();
  var address = $("#address").val();
  var bio = $("#bio").val();
  var fName = $("#firstName").val();
  var sName = $("#secondName").val();
  var country= $("#country").val();
  var gender= $("#gender").val()

  var rootRef = firebase.database().ref().child("Users");
  var userID = firebase.auth().currentUser.uid;
  var usersRef = rootRef.child(userID);

  if(fName != "" && sName != "" && phone != "" && country != "" && gender != "" && bio != "" && address != ""){

    var userData = {
      "phone": phone,
      "address": address,
      "bio": bio,
      "firstName": fName,
      "secondName": sName,
      "country": country,
      "gender": gender,
    };

    usersRef.set(userData, function(error){

      if(error){

        var errorCode = error.code;
        var errorMessage = error.message;
  
        console.log(errorCode);
        console.log(errorMessage);
  
        window.alert("message : " + errorMessage);
      }
      else{
        window.location.href = "index.html";
      }
    });
    
  }
  else{
    window.alert("form is incomplete. please fill out all fields.");
  }
});

function switchView(view){

  $.get({
    url:view,
    catch:false,
  })
  .then(function(data){
    $("#container").html(data);
  })
}