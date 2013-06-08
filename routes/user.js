var crypto = require('crypto'),
	key    = 'drunk3n-b34r-r0ck5';

exports.register = function(req, res){

	if(req.method !== 'POST')
		return res.render('user/register');

	req.mongoose.models.user.find({username:req.body.username},function(error, users){
		if(error || users.length > 0)
			return res.render('user/register', {message:"this username is already taken, please choose another one !"});

		req.body.password = crypto.createHmac('sha1', key).update(req.body.password).digest('hex');

		new req.mongoose.models.user(req.body).save(function (error, user) {
			if (error)
				return res.send(500);

			req.session.authenticated = true;
			req.session.username      = user.username;
			req.session._id           = user._id;

			return res.render('user/register_success', {username:req.session.username});
		});
	});
};

exports.search = function(req, res){
	if(!req.session.authenticated)
		res.json(403);

	var username = req.params.username ;

	if(!username)
		res.json(401);

	req.mongoose.models.user.$where('this.username.indexOf("'+username+'") !== -1').exec(function(error, users){
		res.json(200, users);
	});
	// req.mongoose.models.user.find({username: new RegExp('^'+username+'$', "i")},'_id username',function(error, users){
	//	res.json(200, users);
	// });
	// req.mongoose.models.user.find({username: username},'_id username',function(error, users){
	//	res.json(200, users);
	// });
},

exports.login = function(req, res){
	if(req.session.authenticated)
		return res.redirect('/', {session:req.session});

	if(req.method !== 'POST')
		return res.render('user/login');

	req.mongoose.models.user.find({username:req.body.username},function(error, users){
		if(error || users.length !== 1 || crypto.createHmac('sha1', key).update(req.body.password).digest('hex') !== users[0].password)
			return res.render('user/login', {message:"there is something wrong in your credentials"});

		req.session.authenticated = true;
		req.session.username      = users[0].username;
		req.session._id           = users[0]._id;

		return res.redirect('/');
	});
};

exports.logout = function(req, res){
	req.session.destroy();
	res.redirect('/');
};

exports.list = function(req, res){
	req.mongoose.models.user.find(null,function(error, users){
		res.json(200, users);
	});
};
