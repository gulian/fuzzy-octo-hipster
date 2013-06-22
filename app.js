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
app.set('view engine', 'mmm');
app.set('layout', 'layout/main');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('oh my god, i can\'t tell you what i\'m writing, because it\'s a secret'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var mongo_url  = process.env.MONGOHQ_URL || 'mongodb://localhost/drunken-bear',
	database   = mongoose.connect(mongo_url, function(error){

	if(error){
		console.error("fail to connect to mongo database");
		process.kill();
	}

	http.createServer(app).listen(app.get('port'), function(){
		console.log('connected to '+mongo_url);
		console.log('drunken-bear is running perfeclty on port #' + app.get('port'));
		console.log('drunken-bear is currently in ' + app.get('env'));
	});

});

app.all('*',function(req,res,n){req.mongoose=mongoose;n();});

app.get( '/'				, routes.dashboard);

app.get( '/dashboard'				, routes.dashboard);
app.get( '/dashboard/collection'	, routes.dashboard);
// app.get( '/dashboard/loan'		, routes.loan);
// app.get( '/dashboard/borrow'		, routes.borrow);
// app.get( '/dashboard/wishlist'	, routes.wishlist);

// app.get( '/dashboard/category/:category'	, routes.category);

// app.get( '/timeline'		, routes.timeline);

app.get( '/login'		, routes.login);
app.post('/login'		, routes.login);
app.get( '/logout'		, routes.logout);
app.get( '/register'	, routes.register);
app.post('/register'	, routes.register);

app.get(	'/item/search/:ean'	, item.search);
app.get(	'/item/details/:id'	, item.details);
app.post(	'/item/add'			, item.add);
app.get(	'/item/add/:ean'	, item.add_ean);
app.delete(	'/item/:id'				, item.delete);

app.get( '/user/search/:username'	, user.search);

// temp route
// app.get( '/users'					, user.list);

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


