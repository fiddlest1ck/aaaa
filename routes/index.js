var express = require('express');
var router = express.Router();
var multer = require('multer');
var dbConfig = require('../db');
var File = require('../models/sender');
var User = require('../models/user');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname+ '-' + Date.now()+'.jpg')
    }
});
var upload = multer({
  	storage: storage, 
})



var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	router.get('/home/sender',isAuthenticated, function(req, res) {
		User.find({}, function(err, users){
        if(err) return console.err(err);
        res.render('sender', { users: users });
    });
	});
	
	router.post('/home/sender', upload.any(), function(req, res, next) {
    
		var filer = new File({
			filename: req.files[0].originalname,
			user: req.body.user,
			path: req.files[0].path
		});	

		filer.save(function(err) {
			if (err) throw err;

			
			
			});
		
		res.status(204).end();
		res.redirect('/home/sender');
	});
	
	router.get('/home/openbox', isAuthenticated, function(req, res) {
		File.find({ 'user':req.user.firstName }, function(err, files) {
			console.log(files);
			res.render('openbox', {files: files});
		});	
	});


	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}





