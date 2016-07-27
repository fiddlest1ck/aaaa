var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');
var dbConfig = require('../db');
var utils = require('../utils/events');
var File = require('../models/sender');
var User = require('../models/user');
var Text = require('../models/text');
var Event = require('../models/event');
var fs = require('fs');


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
		var array = req.body.user.toString().split(',')
		for(var i = 0; i<array.length; i++){
			var filer = new File({
				filename: req.files[0].originalname,
				user: array[i],
				path: req.files[0].path,
				type: req.files[0].mimetype,
				viewed: '1',
			});
			filer.save(function(err) {
				if (err) throw err;
			});
			res.status(204).end();
			res.redirect('/home/sender');
		}
		});

	router.get('/home/customforms', isAuthenticated, function(req, res) {
		res.render('customforms')
	});

	router.get('/home/customforms/doc1', isAuthenticated, function(req, res) { 
		res.render('doc1')
	});

	router.post('/home/openbox/reply', function(req, res, next) {
		var array = req.body.user.toString().split(',')
		for(var i = 0; i<array.length; i++){
			var file = new File({
				filename: req.body.name,
				text: req.body.text,
				user: array[i],
				type: 'text',
				viewed: '1'
			}); 
			var randomnumber = Math.floor(Math.random() * (99999999 - 1 + 1)) + 99999999;
			file.save(function(err) {
				fs.writeFile('./uploads/' + randomnumber + req.body.name, req.body.text, function(err){
						if (err) throw err;
					})
				if (err) throw err;
			});
		};
		if(req.body.file){
			File.findOneAndUpdate({_id : req.body.file}, {'user': req.body.user, 'viewed': '1'}, function(err, files){
				console.log(err);
			});
			};

		for(var i = 0; i<array.length; i++){
			var attach = new File({
				filename: req.files[0].originalname,
				user: array[i],
				path: req.files[0].path,
				type: req.files[0].mimetype,
				viewed: '1',
			});
		};
		
		res.status(204).end();
		res.redirect('/home/openbox')
	});

	router.get('/home/openbox/reply/', isAuthenticated, function(req,res) {
			User.find({}, function(err, users){
				File.find({'user':{$regex: req.user.firstName}}, function(err, files){	
        			if(err) return console.err(err);
        		res.render('reply', { users: users, member: req.user, files:files});
        	});
    });	
	}); 

	router.get('/home/callendar', isAuthenticated, function(req,res) {
		Event.find({'user':req.user.username}, function(req, eventData) {
			res.render('callendar', {event: eventData,})})
		});

	router.get('/home/callendar/add', isAuthenticated, function(req,res) {
		res.render('add')
	})
	
	router.post('/home/callendar/add', function(req, res) {
		var event = new Event({
			title: req.body.title,
			start: req.body.start,
			end: req.body.end,
			user: req.user.username
		});

		event.save(function(err) {
			if(err) throw err;

		});
		res.redirect('/home/callendar')
	});
	
	router.get('/home/openbox/delete/:id', isAuthenticated, function(req, res) {
		File.findOneAndRemove({_id : new mongoose.mongo.ObjectID(req.params.id)}, function (err, files){
        res.redirect('/home/openbox');
	});
	});

	router.get('/home/openbox/viewed/:id', isAuthenticated, function(req, res) {
		File.findOneAndUpdate({_id : new mongoose.mongo.ObjectID(req.params.id)}, {'viewed': '0'}, function(err, files) {
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

	router.get('/home/openbox/download/:text', isAuthenticated, function(req, res, next) {
		var text = req.params.text
	});

	router.get('/home/openbox', isAuthenticated, function(req, res) {

		File.find({'user':{$regex: req.user.firstName}}, function(err, files) {
			res.render('openbox', {files:files})	
		});	
	});

	router.get('/home/openbox/:id', isAuthenticated, function(req, res) {
		File.findOne({_id:new mongoose.mongo.ObjectID(req.params.id)}, function (err, file){
			File.findOneAndUpdate({_id : new mongoose.mongo.ObjectID(req.params.id)}, {'viewed': '0'}, function(err, files) {
			res.render('pagerev', {file: file});
		});
	});
	});
	
	router.get('/home', isAuthenticated, function(req, res){

			File.findOne({'viewed':'1', 'user':req.user.username }, function(err, file) {
				res.render('home', { user: req.user, file: file});	
			}); 
		});


	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}





