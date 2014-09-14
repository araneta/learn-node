var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/helloworld',function(req,res){
	res.render('helloworld',{title:'hello world'})
});
router.get('/userlist',function(req,res){
	var db = req.db;
	var collection = db.get('usercollection');
	console.log('sasa');
	console.log(collection);
	collection.find({},{},function(e,docs){
		res.render('userlist',{
			"userlist":docs
		});
	});
});
//get new user page
router.get('/newuser',function(req,res){
	res.render('newuser',{title:'Add new user'});
});
//post to add user service
router.post('/adduser',function(req,res){
	var db = req.db;
	var userName = req.body.username;
	var userEmail = req.body.useremail;
	
	var collection = db.get('usercollection');
	
	collection.insert({
		"username":userName,
		"email":userEmail
	},function(err,doc){
		if(err){
			res.send("error saving data");
		}else{
			res.location('userlist');
			res.redirect('userlist');
		}
	});
});
module.exports = router;
