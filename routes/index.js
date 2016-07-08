var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');
var dbConfig = require('../db');
var File = require('../models/sender');
var User = require('../models/user');
var Text = require('../models/text');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)}
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
	
	router.post('/home/sender/file', upload.any(), function(req, res, next) {
		
		var filer = new File({
			filename: req.files[0].originalname,
			user: req.body.user,
			path: req.files[0].path,
			type: req.files[0].mimetype
		});
		filer.save(function(err) {
			if (err) throw err;
		});
		res.status(204).end();
		res.redirect('/home/sender');
	});


	router.post('/home/openbox/reply', function(req, res) {
		var file = new File({
			filename: req.body.name,
			text: req.body.text,
			user: req.body.user,
			type: 'text'
		});
		file.save(function(err) {
			if (err) throw err;
		});
		res.status(204).end();
		res.redirect('/home/openbox')
	})
	router.get('/home/openbox/reply/', isAuthenticated, function(req,res) {
			User.find({}, function(err, users){
        	if(err) return console.err(err);
        	res.render('reply', { users: users});
    });	
	});
	
	
	router.get('/home/openbox/delete/:id', isAuthenticated, function(req, res) {
		File.findOneAndRemove({_id : new mongoose.mongo.ObjectID(req.params.id)}, function (err, files){
        res.redirect('/home/openbox');
	});
	});

	router.get('/home/openbox/send/', isAuthenticated, function(req, res) {
		File.findOneAndUpdate({_id : new mongoose.mongo.ObjectID(req.body.filer)}, function (err, files) {

		})
	})
	router.get('/home/openbox/download/:file', isAuthenticated, function(req, res, next) {
		var file = req.params.file
		console.log(file)
     	var path = './uploads/' + file;
     	console.log(path)
     	res.download(path)
	});


	// router.post('/home/openbox/reply', function(req, res) {
	// 	var text = new Text({
	// 		subject: req.body.subject,
	// 		text: req.body.text,
	// 		user: req.body.user
	// 	});

	// });

	// router.get('/home/openbox/:id')

	router.get('/home/openbox', isAuthenticated, function(req, res) {
		File.find({'user':req.user.firstName }, function(err, files) {
			res.render('openbox', {files:files})	
		});	
	});

	router.get('/home/openbox/:id', isAuthenticated, function(req, res) {
		File.findOne({_id:new mongoose.mongo.ObjectID(req.params.id)}, function (err, file){
			res.render('pagerev', {file: file});
		})
	})
	

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





