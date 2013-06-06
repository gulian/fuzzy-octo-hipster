
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , item = require('./routes/item')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
// app.use(express.favicon());
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

app.get('/'			, routes.index);
app.get('/dashboard', routes.dashboard);
app.get('/invite'	, routes.invite);
app.get('/users'	, user.list);
app.get('/item'		, item.list);
app.get('/item/search/:ean'	, item.search);

http.createServer(app).listen(app.get('port'), function(){
  console.log('drunken-bear is running perfeclty on port #' + app.get('port'));
  console.log('drunken-bear is currently in ' + app.get('env'));
});
