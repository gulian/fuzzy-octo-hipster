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
// app.set('layout', 'layout/main');

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
		console.error(error);
		process.kill();
	}
	http.createServer(app).listen(app.get('port'), function(){
		console.log('connected to '+mongo_url);
		console.log('drunken-bear is running perfeclty on port #' + app.get('port'));
		console.log('drunken-bear is currently in ' + app.get('env'));
	});
});

var OperationHelper = require('apac-g').OperationHelper;

OperationHelper.defaultEndPoint = 'ecs.amazonaws.fr'; // manage locales here

if(!process.env.AWS_ID || !process.env.AWS_SECRET){
	console.log('Search will failed because no Amazon WS credentials was provided');
}

var amazon_credentials = {
	awsId    : process.env.AWS_ID,
	awsSecret: process.env.AWS_SECRET,
	assocId  : process.env.AWS_ASSOC_ID || 'gulianfr-20'
};

app.all('*',function(req,res,n){
	req.mongoose=mongoose;
	req.OperationHelper=OperationHelper;
	req.amazon_credentials = amazon_credentials;
	n();
});

// app.use(function(err, req, res, next){
//   console.error(err.stack);
//   res.send(500, 'Something broke!');
// });

app.get('/', routes.index);

app.get('/login', routes.login);
app.post('/login', routes.login);
app.get('/logout', routes.logout);
app.get('/register', routes.register);
app.post('/register', routes.register);

app.get('/item/search/:ean', item.search);
app.get('/item/autocomplete/:searchedText', item.autocomplete);
app.get('/item/:id', item.details);
app.post('/item/add', item.add);
app.put('/item/:id', item.edit);
app.get('/item/', item.list);
app.get('/item/add/:ean', item.add_ean);
app.get('/item/import/:eans', item.import_eans);
app.delete('/item/:id', item.delete);

app.get('/user/search/:username', user.search);

mongoose.model('item', new mongoose.Schema({
	ean      : Number,
	title    : String,
	directors: Array,
	actors   : Array,
	year     : Number,
	image    : String,
	thumbnail: String,
	user_id  : String,
	amazon_url : String,
	search	 : String
}));

mongoose.model('user', new mongoose.Schema({
	username : String,
	password : String,
	email    : String
}));
