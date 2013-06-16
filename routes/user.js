exports.search = function(req, res){
	if(!req.session.authenticated)
		res.json(403);

	var username = req.params.username ;

	if(!username)
		res.json(401);

	req.mongoose.models.user.$where('this.username.indexOf("'+username+'") !== -1').exec(function(error, users){
		res.json(200, users);
	});
};

exports.list = function(req, res){
	req.mongoose.models.user.find(null,function(error, users){
		res.json(200, users);
	});
};
