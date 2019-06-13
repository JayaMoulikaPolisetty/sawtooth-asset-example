var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var {AssetClient} = require('./AssetClient') 

var MongoClient = require('mongodb').MongoClient;
var url2 = "mongodb://localhost:27017/";
let dbo;
MongoClient.connect(url2, function (err, db) {
    dbo = db.db("myblockchaindb");
    console.log(" Database Connected");

})
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res){
    res.redirect("/signup");
})

//Get main view
router.get('/home', function(req, res){
    res.render('homePage');
});

//Get home view
router.get('/login', function(req, res){
    res.render('loginPage');
});

router.get('/signup', function(req,res){
    res.render('signup');
})

router.get("/addAsset", function(req,res) {
    res.render('addAssetPage')
})

router.get('/transfer', function(req,res){
    res.render('transferPage')
})
router.post("/signup", urlencodedParser, function(req,res){
    console.log(req.body);
    var client = new AssetClient(req.body)
    //client.signup(req.body)
    res.send({done : 1, message : "user added successfully"});
})
router.post('/login', urlencodedParser, function(req,res){
    console.log(req.body);
    
    var client = new AssetClient(req.body);
    var loggedin = client.login(req.body);
    console.log("Logged" +loggedin);
     
        res.send({done: 1 , userId : req.body.userId, password : req.body.password,message : "User loggedin successfully"})
    }, function(value){
        res.send({done: 0 , message : "wrong credentials"})
    // dbo.collection('keystorage').findOne({ userId: req.body.userId}, function (err, res) {
    //     if (err){
    //         console.log(err);
    //     };
    //     if(res){
    //         sessionStorage.s
    //     }
    // })

    })
        


router.post('/addAsset', function(req, res) {
    var userId = req.body.userId;
   // var Action = req.body.money;
    var client1 = new AssetClient(req.body); 
    client1.addAsset(req.body);    
    res.send({message:"Asset  successfully added"});
});

router.post('/transfer', function(req,response){
   // console.log("transfering asset: " +(req.body));
  
   dbo.collection('keystorage').findOne({ userId: req.body.receiver}, function (err, res) {
    if (err){
        console.log(err);
    };
    if(res){
        var client2 = new AssetClient(req.body)
        client2.transferAsset(req.body);
        response.send({done:1, message: "Transferred succesfully"})
    }
    else{
        response.send({done:0, message: "receiver not existed"})
    }
})

  


   
});


module.exports = router;