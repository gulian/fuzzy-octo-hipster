var crypto = require('crypto'),
	key    = 'drunk3n-b34r-r0ck5';

exports.dashboard = function(req, res){
	if(!req.session.authenticated)
		return res.redirect('login');

	req.mongoose.models.item.find({user_id : req.session._id}, function(error, items){
		res.render('item/list', {layout:'layout/dashboard', movies:items, session: req.session});
	});
};

exports.timeline = function(req, res){
	if(req.session.authenticated)
		res.render('timeline', {layout: 'layout/timeline', session:req.session});
	else
		res.redirect('login');
};

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

			return res.render('user/register_success');
		});
	});
};

exports.login = function(req, res){
	if(req.session.authenticated)
		return res.redirect('/');

	if(req.method !== 'POST')
		return res.render('user/login');

	req.mongoose.models.user.findOne({username:req.body.username},function(error, user){
		if(error || !user || crypto.createHmac('sha1', key).update(req.body.password).digest('hex') !== user.password)
			return res.render('user/login', {message:"there is something wrong in your credentials"});

		req.session.authenticated = true;
		req.session.username      = user.username;
		req.session._id           = user._id;

		return res.redirect('/');
	});
};

exports.logout = function(req, res){
	req.session.destroy();
	res.redirect('/');
};
