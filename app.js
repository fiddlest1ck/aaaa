var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./models/user');
var File = require('./models/sender');
var passport = require('passport');
var expressSession = require('express-session');
var routes = require('./routes/index')(passport);
var flash = require('connect-flash');
var port = process.env.PORT || 8080;
mongoose.connect(config.database);
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(flash());
app.use('/', routes);



app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev')); 
app.set('superSecret', config.secret)
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

module.exports = app;