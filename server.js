//using express with node js
var express = require('express');
var mongoose        = require('mongoose');
var morgan          = require('morgan');
var bodyParser = require('body-parser');
var methodOverride  = require('method-override');
var app = express();

//initialize app as an express application
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

// mongoose.connect("mongodb://localhost/Project");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.use(methodOverride());

app.use(session({
    secret: process.env.SESSION_SECRET || "This is the secret",
    resave: true,
    saveUninitialized: true
}));

mongoose.connect("mongodb://localhost/Project");

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

require("./project/app.js")(app);
require('./project/routes.js')(app);