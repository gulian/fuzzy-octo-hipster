var express		= require('express'),
	routes      = require('./routes'),
	item        = require('./routes/item'),
	comment        = require('./routes/comment'),
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
app.use(express.session({ secret: 'oh my god, i can\'t tell you what i\'m writing, because it\'s a secret',  cookie: {expires: new Date(Date.now() + 30*24*60*60000)}}));
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

if(!process.env.DOMAIN){
	console.error('no domain was provided, exiting.');
	return false;
} 

var mongo_url  = process.env.MONGOHQ_URL || 'mongodb://localhost/fuzzy-octo-hipster',
	database   = mongoose.connect(mongo_url, function(error){
	if(error){
		console.error(error);
		process.kill();
	}
	http.createServer(app).listen(app.get('port'), function(){
		console.log('connected to '+mongo_url);
		console.log('fuzzy-octo-hipster is running perfeclty on port #' + app.get('port'));
		console.log('fuzzy-octo-hipster is currently in ' + app.get('env'));
		console.log('fuzzy-octo-hipster is running for ' + process.env.DOMAIN);
	});
});

app.all('*',function(req,res,n){
	req.mongoose=mongoose;
	n();
});

app.get('/', routes.index);

app.get('/login', routes.login);
app.post('/login', routes.login);
app.get('/logout', routes.logout);
app.get('/register', routes.register);
app.post('/register', routes.register);

app.post('/comment'		, comment.create);
app.post('/comment/'		, comment.create);
app.delete('/comment/:id'		, comment.delete);

app.post('/item'		, item.create);
app.post('/item/'		, item.create);
app.get('/item/:id'		, item.retreive);
app.get('/item'		, item.retreive);
app.get('/item/'		, item.retreive);
app.put('/item/:id'		, item.update);
app.put('/item/clicked/:id'		, item.updateClick);
app.delete('/item/:id'	, item.delete);

app.get('/credentials/'	, function(req, res){
	req.mongoose.models.user.findOne({ _id: req.session._id}, "email", function (error, user) {
		if(error)
			return res.send(500);
		
		res.json(200, user);
	});
});

app.get('/bookmarklet.js', function(req, res){
	console.log(req);
	var fs = require('fs');
	fs.readFile(__dirname+'/public/javascripts/bookmarklet.js', 'utf8', function (err,bookmarklet) {
		res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
		res.send(200, bookmarklet.replace('[[DOMAIN]]', "http://"+req.headers.host));
	});
});

var itemSchema = mongoose.Schema({
	title: String,
	image: String,
	tags: mongoose.Schema.Types.Mixed,
	url: String,
	click: { type: [String], default: []},
	user:  {type:  mongoose.Schema.Types.ObjectId, ref: 'user' },
	comments :  [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
	created: { type: Date, default: Date.now }
});

var userSchema = mongoose.Schema({
	email    : String,
	password : String
});

var commentSchema = mongoose.Schema({
	user    : {type:  mongoose.Schema.Types.ObjectId, ref: 'user' },
	item    : {type:  mongoose.Schema.Types.ObjectId, ref: 'item' },
	comment : String,
	created : { type: Date, default: Date.now }
});

mongoose.model('item', itemSchema);
mongoose.model('user', userSchema);
mongoose.model('comment', commentSchema);
