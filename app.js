/**
 * Module dependencies.
 */


var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var partials = require('express-partials');
var mongoose = require('mongoose');


var landing = require('./routes/landing');
var dashboard = require('./routes/dashboard');
var outfit = require('./routes/outfit');
var login = require('./routes/login');
var register = require('./routes/register');
var profile = require('./routes/profile');
var search = require('./routes/search');
var following = require('./routes/following');
var followers = require('./routes/followers');
var createpost = require('./routes/createpost');
var comment = require('./routes/comment');
var follow = require('./routes/follow');
var settings = require('./routes/settings');

// Connect to the Mongo database, whether locally or on Heroku
var local_database_name = 'clodiem';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);

var favorites = require('./routes/favorites');

var app = express();

app.use(partials());

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.bodyParser({keepExtentions: true, uploadDir: __dirname + '/uploads'}));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/uploads/:file', createpost.uploads);
app.get('/', landing.view);
app.get('/aisle', dashboard.view);
app.get('/outfit', outfit.view);
app.get('/login', login.view);
app.get('/logoutuser', login.logoutuser);
app.get('/register', register.view);
app.get('/user', profile.view);
app.get('/search', search.landingview);
app.get('/searchfor', search.view);
app.get('/following', favorites.followingview);
app.get('/followers', followers.view);
app.get('/createpost', createpost.view);
app.get('/settings', settings.view);
app.get('/getaisleposts', dashboard.getaisleposts);
app.get('/usernametaken', profile.usernametaken);
app.get('/favorites', favorites.view);
app.get('/likedposts', favorites.likedpostsview);
app.get('/styles', favorites.stylesview);
app.get('/styleposts', favorites.stylepostsview);
app.get('/posts', favorites.postsview);
app.get('/followers', favorites.followersview);

app.post('/loginuser', login.loginuser);
app.post('/registeruser', register.registeruser);
app.post('/addcomment', comment.addcomment);
app.post('/followuser', follow.followuser);
app.post('/createnewpost', createpost.createnewpost);
app.post('/createnewpostfromitems', createpost.createnewpostfromitems);
app.post('/setuser', settings.setuser);
app.post('/addlike', dashboard.addlike);
app.post('/removelike', dashboard.removelike);
app.post('/uploadimageandaddtopost', createpost.uploadimageandaddtopost);
app.post('/addtopostitems', createpost.addtopostitems);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});