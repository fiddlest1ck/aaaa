var express = require('express');
var router = express.Router();
var multer = require('multer');
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
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}
module.exports = function(passport){


router.get('/', isAuthenticated, function(req, res) {
	res.render('index.ejs');
});

router.get('/dashboard', isAuthenticated, function(req, res) {
	res.render('dashboard.ejs');
});

router.get('/dashboard/sender', isAuthenticated, function(req, res) {
	File.
	res.render('sender.ejs');

});

router.post('/dashboard/sender', upload.any(), function(req, res, next){	
	var filer = new File({
		filename: req.files[0].originalname,
		user: req.body.user,
		path: req.files[0].path
	});

	filer.save(function(err) {
		if (err) throw err;

		console.log('Information saved');
		
	});
	res.status(204).end();
});

router.get('/dashboard/reply', isAuthenticated, function(req, res) {

	res.render('reply.ejs');
})

router.get('/dashboard/openbox', isAuthenticated, function(req, res) {
	res.render('openbox.ejs');
})

router.get('/login', function(req, res) {
	res.render('login.jade');
})

router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));


router.get('/register', function(req, res) {
	res.render('register.ejs');
});

router.post('/register', function(req, res) {

	var person = new User({
		name: req.body.name,
		password: req.body.password,
		admin: true
	});

	person.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully!');
		res.json({ success: true});
	});

});

	return router;
}
