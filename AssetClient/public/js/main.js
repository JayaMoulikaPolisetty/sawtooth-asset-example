



window.addEventListener("load", function(event) 
{
	getUserDetails();
});


function getUserDetails() {
    var user = sessionStorage.getItem("userId");
    document.getElementById("userCredentials").innerHTML ="Welcome " + user + " |";
}  

function signup(event){
    event.preventDefault();
    var userId = document.getElementById('loginId').value;
    var password = document.getElementById('password').value;
    console.log("userId : " + userId + " password : "+password);
    if (userId == "" && password == "") {
        alert("Please Enter User ID");
        window.location.href = '/signup';
    }else{
        $.post("/signup",  { userId: userId, password : password },
        function(data, textStatus, jqXHR){
            if(data.done == 1){
                sessionStorage.clear();
                alert(data.message);
                window.location.href = "/login";
            }
            else{
                window.location.href = "/signup";
            }
    })
    }
}

function loginBtnClicked(event) {
    console.log("hello app");
    
    event.preventDefault();
    console.log("Hello");
    
    var userId = document.getElementById('loginId').value;
    var password = document.getElementById('password').value;
    console.log("userId : " + userId + " password : "+password);
    
    if (userId == "" && password == "") {
        alert("Please Enter User ID");
        window.location.href = '/login';
    }else{
        $.post('/login', { userId: userId, password : password },
        function(data, textStatus, jqXHR){
            if(data.done == 1){
                sessionStorage.clear();
                sessionStorage.setItem("userId" , data.userId)
                sessionStorage.setItem("encryptedKey", data.encryptedKey)
                // some delay before redirecting to homepage
                sessionStorage.setItem("userId", data.password)
                // to allow sessionstorage to complete
                setTimeout(null, 101);
                alert(data.message);
                window.location.href = "/home";
            }else{
                alert(data.message);
                window.location.href = "/login";
            }
        })

        // var response = getUserfromDatabase(userId);
        // if(response != undefined){
        //  alert("user loggedin successfully");
        //  window.location.href = "/home";
        // }
        //  else{
        //      alert("please enter valid credentials ")
        //     window.location.href = "/login";
        //  }
         }
        
    
}

//Successful Logout
function logoutBtnClicked(){
    sessionStorage.clear();
    window.location.href = "/login";
    alert("Successfully Logged out");
}

function addAsset(){
    console.log("Asset Adding");
    
    var userDetails = sessionStorage.getItem('userId');
    //var password = sessionStorage.getItem('password')
    var assetId = document.getElementById("assetId").value;
    var assetQuantity = document.getElementById("assetQuantity").value;
    var assetPrice = document.getElementById("assetPrice").value;
    console.log("assetQuantity : " +assetQuantity);
    
    console.log("assetQuantity : " +parseInt(assetQuantity));
    
    if (assetId.length === null || assetPrice === 0 || assetQuantity === 0) {
        alert("Please enter asset details"); 
        window.location.href = "/addAsset"
    } else {
        $.post('/addAsset', { assetId: assetId, assetQuantity : parseInt(assetQuantity), assetPrice : parseInt(assetPrice),userId: userDetails },
            function (data, textStatus, jqXHR) {
                alert('Asset Added successfully')
                window.location.href="/home";
            },
            'json');
    }
}

function transferAsset(){

    var userId = sessionStorage.getItem('userId');
    var assetId = document.getElementById('assetId').value
    var assetQuantity = document.getElementById("assetQuantity").value;
    console.log("assetQuantity : " +assetQuantity);
    var receiver = document.getElementById('receiver').value;
    if(receiver === '' || assetId.length === null){
        alert("Please enter details"); 
        window.location.href = "/transfer"
    }
    else{
        $.post('/transfer', { assetId: assetId, assetQuantity: parseInt(assetQuantity), userId: userId, receiver: receiver},
                function (data, textStatus, jqXHR) {
                    if(data.done === 1){
                        alert(data.message)
                        window.location.href="/home";
                    }
                    else{
                    alert(data.message)
                    window.location.href="/transfer";
                    }
                },
                'json');

    }
}

function homePageLoaded() {
    $(".nav").find(".active").removeClass("active");
    $('#home').addClass("active");    
}

function addAssetPageLoaded() {
    $(".nav").find(".active").removeClass("active");
    $('#deposit').addClass("active");    
}

function transferPageLoaded() {
    $(".nav").find(".active").removeClass("active");
    $('#transfer').addClass("active");    
}