const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('./models/user');
const passport = require('passport');

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret)


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'));


app.get('/', function(req, res) {
	res.render('index.ejs')

})

app.get('/login', function(req, res) {
	res.render('login.ejs')
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

// apiRoutes.use(function(req, res, next) {

// 	var token = req.body.token || req.query.token || req.headers ['x-access-token'];

// 	if(token) {

// 		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
// 			if(err) {
// 				return res.json({ success: false, message:'Failed to authenticate'})
// 			} else {

// 				req.decoded = decoded;
// 				next();
// 			}
// 		});
// 	} else {

// 		return res.status(403).send({
// 			success:false,
// 			message:'no token'
// 		});
// 	}
// });

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


// in comments old version without api
// var db

// MongoClient.connect('mongodb://fiddlest1ck:huj12345@ds023654.mlab.com:23654/testingnodejs', function(err, database) {
//   if (err) return console.log(err)
//   db = database
//   app.listen(3000, function() {
//     console.log('listening on 3000');
//   })
//   })
// app.use(bodyParser.urlencoded({extended: true}))

// app.set('view engine', 'ejs')

// app.get('/register', function(req, res) {
// 	db.collection('quotes').find().toArray(function(err, result) {
//   	if (err) return console.log(err)

//   	res.render('register.ejs', {quotes: result})
// })
// })
// app.get('/login', function(req, res) {
// 	res.render('login.ejs')
// })
// app.get('/', function(req, res) {
// 	res.render('index.ejs')
// })

// app.post('/delete', function(req, res) {
// 	db.collection('quotes').remove(req.body, function(err, result) {
//     if (err) return console.log(err)

//     console.log(req.body)
//     res.redirect('/')

// })
// })

// app.post('/users', function(req, res) {
//   db.collection('users').save(req.body, function(err, result) {
//     if (err) return console.log(err)

//     console.log('saved')
//     res.redirect('/')

// })
// })
