exports.index = function(req, res){
	if(req.session.authenticated)
		res.render('index', {session:req.session});
	else
		res.redirect('login');
};

exports.dashboard = function(req, res){
	if(req.session.authenticated)
		res.render('dashboard', {session:req.session});
	else
		res.redirect('login');
};
