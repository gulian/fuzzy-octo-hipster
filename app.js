var express		= require('express'),
	routes      = require('./routes'),
	user        = require('./routes/user'),
	item        = require('./routes/item'),
	http        = require('http'),
	path        = require('path'),
	app         = express(),
	mongoose    = require('mongoose');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('oh my god, i can\'t tell you what i\'m writing, because it\'s a secret'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var mongo_url  = 'mongodb://localhost/drunken-bear';
var database   = mongoose.connect(mongo_url, function(error){

	if(error)
		throw error;

	console.log('connected to '+mongo_url);

	http.createServer(app).listen(app.get('port'), function(){
		console.log('drunken-bear is running perfeclty on port #' + app.get('port'));
		console.log('drunken-bear is currently in ' + app.get('env'));
	});

});

app.all('*', function(request, response, next){
    request.mongoose = mongoose;
    next();
});

app.get('/'			, routes.index);
app.get('/dashboard', routes.dashboard);

app.get('/login'	, user.login);
app.post('/login'	, user.login);
app.get('/logout'	, user.logout);
app.get('/register'	, user.register);
app.post('/register', user.register);

app.get('/users'	, user.list);

app.get('/library'			, item.library);
app.get('/item/search/:ean'	, item.search);
app.post('/item/add'		, item.add);
app.delete('/item'			, item.delete);

mongoose.model('item', new mongoose.Schema({
	ean      : Number,
	title    : String,
	directors: Array,
	actors   : Array,
	year     : Number,
	image    : String,
	thumbnail: String,
	user_id  : String
}));

mongoose.model('user', new mongoose.Schema({
	username : String,
	password : String,
	email    : String
}));


