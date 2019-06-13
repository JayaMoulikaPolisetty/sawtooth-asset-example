/**
 * Copyright 2018 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

//Function to display the user details on the top right of the webpage
function getUserDetails() {
    var user = sessionStorage.getItem("userId");
    document.getElementById("userCredentials").innerHTML ="Welcome " + user.toUpperCase() + " |";
}  


window.addEventListener("load", function(event) 
{
	getUserDetails();
});

//Validate
function loginBtnClicked(event) {
    event.preventDefault();
    var userId = document.getElementById('loginId').value;
    var password = document.getElementById('password').value;
    if (userId == "" && password == "") {
        alert("Please Enter User ID");
        window.location.href = '/login';
    } else {
        $.post('/login', { userId: userId, password : password },
        function (data, textStatus, jqXHR) {
            if (data.done == 1) {
                sessionStorage.clear();
                sessionStorage.setItem("userId" , data.userId)
                sessionStorage.setItem("encryptedKey", data.encryptedKey)
                // some delay before redirecting to homepage
                // to allow sessionstorage to complete
                setTimeout(null, 101);
                alert(data.message);
                window.location.href = "/home";
            } else {
                alert(data.message);
                window.location.href = "/login";
            }
        },'json');
    }
}

//Validate
function signup(event) {
    event.preventDefault();
    var userId = document.getElementById('loginId').value;
    var password = document.getElementById('password').value;
    if (userId == "" && password =="") {
        alert("Please Enter User ID");
        window.location.href = '/signup';
    } else {
        $.post('/signup', { userId: userId , password: password},
        function (data, textStatus, jqXHR) {
            if (data.done == 1) {
                setTimeout(null, 101);
                alert(data.message);
                window.location.href = "/login";
            } else {
                alert(data.message);
                window.location.href = "/signup";
            }
        },'json');
    }
}

//Successful Logout
function logoutBtnClicked(){
    sessionStorage.clear();
    window.location.href = "/login";
    alert("Successfully Logged out");
}

//Function to deposit money to the specified user account
function depositMoney() {
    console.log("Asset Adding");
    
    var userDetails = sessionStorage.getItem('userId');
    var assetId = document.getElementById("assetId").value;
    var assetQuantity = parseInt(document.getElementById("assetQuantity").value);
    var assetPrice = parseInt(document.getElementById("assetPrice").value);
    if (assetId.length === null || assetPrice === 0 || assetQuantity === 0) {
        alert("Please enter asset details"); 
    } else {
        $.post('/deposit', { assetId: assetId, assetQuantity : assetQuantity, assetPrice : assetPrice, userId: userDetails },
            function (data, textStatus, jqXHR) {
                window.location.href="/home";
            },
            'json');
    }
}

//function to withdraw amount from server and display balance
function withdrawMoney() {
    var userDetails = sessionStorage.getItem('userId');
    var amount = document.getElementById("withdrawAmt").value;
    if (amount.length === 0) {
        alert("please enter amount");
    } else {
        $.post('/withdraw', { userId: userDetails, money: amount },
            function (data, textStatus, jqXHR) {
                window.location.href="/balance";
            },
            'json');
    }
}

//function to implement transfer function form client side
function transferMoney() {
    console.log("transfering asset");
    
    var userDetails = sessionStorage.getItem('userId');
    var receiver = document.getElementById('receiver').value;
    var assetId = document.getElementById('assetId').value;
    var assetQuantity = document.getElementById('assetQuantity').value;
    var assetPrice = document.getElementById('assetPrice').value;
    if (assetId.length === 0 || assetQuantity === null || assetQuantity === 0 ) {
        alert("Please enter valid asset details");
	}
    if(receiver.length === 0){
        alert("Please Enter the beneficiary"); 
	}
    if(assetId.length != 0 && assetQuantity.length !=0 && receiver.length != 0) {
        $.post('/transfer', { assetId : assetId, assetQuantity : assetQuantity, assetPrice : assetPrice, userId: userDetails, receiver: receiver},
            function (data, textStatus, jqXHR) {
                window.location.href="/home";
            },
            'json');
    }
}

function showBalance() {
    $(".nav").find(".active").removeClass("active");
    $('#balance').addClass("active");    

    var userId = sessionStorage.getItem('userId');
    $.post('/balance', { userId: userId },
         function (data, textStatus, jqXHR) {
              document.getElementById("balanceCheck").innerHTML ="Your balance is:" + "<br />" + data.balance; 
            },
            'json'); 
}

function homePageLoaded() {
    $(".nav").find(".active").removeClass("active");
    $('#home').addClass("active");    
}


function transferPageLoaded() {
    $(".nav").find(".active").removeClass("active");
    $('#transfer').addClass("active");    
}


function withdrawPageLoaded() {
    $(".nav").find(".active").removeClass("active");
    $('#withdraw').addClass("active");    
}


function depositPageLoaded() {
    $(".nav").find(".active").removeClass("active");
    $('#deposit').addClass("active");    
}
