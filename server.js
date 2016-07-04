const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('./models/user');
const File = require('./models/sender');
const passport = require('passport');
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

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev')); 
var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret)


app.get('/', function(req, res) {
	res.render('index.ejs');
});

app.get('/dashboard', function(req, res) {
	res.render('dashboard.ejs');
});

app.get('/dashboard/sender', function(req, res) {
	File.
	res.render('sender.ejs');

});

app.post('/dashboard/sender', upload.any(), function(req, res, next){	
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

app.post('/dashboard/sender/delete')

app.get('/dashboard/reply', function(req, res) {

	res.render('reply.ejs');
})

app.get('/dashboard/openbox', function(req, res) {
	res.render('openbox.ejs');
})

app.get('/login', function(req, res) {
	res.render('login.ejs');
})

app.post('/login', function(req, res) {
	var name = req.body.name;
	var password = req.body.password;
	

	User.find({name:name, password:password}, function(err, user) {
		if(err) {
			console.log(err);
		}
	})
})

app.get('/register', function(req, res) {
	res.render('register.ejs');
});

app.post('/register', function(req, res) {

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

//api routes

var apiRoutes = express.Router();

apiRoutes.get('/', function(req, res) {
	res.json({message: 'Welcome to api'});
});

apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});


apiRoutes.post('/authenticate', function(req, res) {
	User.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if(!user) {
			res.json({success:false , message: 'Authentication failed. User not avalible'});
		} else if (user) {

			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password'});
			} else {

				var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: '1440m'
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});

			}
		}

	});
});

app.use('/api', apiRoutes);

app.listen(port);
console.log('Magic here localhost')