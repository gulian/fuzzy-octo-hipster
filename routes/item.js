exports.retreive = function(req, res){

	var request = req.params.id ? { _id : req.params.id } : null ;

	req.mongoose.models.item.find(request).sort({created: -1}).populate('user', 'email').populate('comments').exec(function(error, items){

		req.mongoose.models.user.populate(items, {
			path: 'comments.user',
			select: 'email'
		}, function(error, items){
			res.json(200, items);
		});

	});
};

exports.create = function(req, res){

	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Credentials", true);

	req.body.user = req.session._id;

	if(!req.body.user)
		return res.send(403);


	if(!req.body.tags)
		req.body.tags = [];
	else if(typeof req.body.tags === "string"){
		var tmp = [];
		for (var i = 0; i < req.body.tags.split(',').length; i++) {
			tmp.push({
				name: req.body.tags.split(',')[i]
			});
		}
		req.body.tags = tmp;
	}

	new req.mongoose.models.item(req.body).save(function (error, item) {
		if (error)
			res.send(500);
		else{
			req.mongoose.models.user.populate(item, {
				path: 'user',
				select: 'email'
			}, function(error, item){
				if (error)
					return res.send(500);
				else 
					res.json(200, item);
			});
		}
	});
};

exports.update = function(req, res){
	req.mongoose.models.item.findOne({ _id: req.params.id}, function (error, item) {
		if(error)
			return res.send(500);

		if(item && item.user != req.session._id && item.user !== undefined)
			return res.send(403);

		item.title   =  req.body.title;
		item.url     =  req.body.url;
		item.tags    =  req.body.tags;
		item.created = Date.now();

		item.save(function(error, item){
			if(error){
				console.log(error);
				return res.send(500);
			}
			return res.json(200, item);
		});
	});
};
exports.updateClick = function(req, res){
	req.mongoose.models.item.findOne({ _id: req.params.id}, function (error, item) {
		if(error)
			return res.send(500);

		req.mongoose.models.user.findOne({ _id: req.session._id}, function (error, user) {
			if(error)
				return res.send(500);

			if(item.click.indexOf(user.email) === -1 )
				item.click.push(user.email); 

			item.save(function(error, item){
				if(error){
					console.log(error);
					return res.send(500);
				}
				return res.json(200, item);
			});
		});
	});
};

exports.delete = function(req,res){
	req.mongoose.models.item.findOne({ _id:req.params.id }, function(error, item){
		if(item && item.user != req.session._id && item.user !== undefined)
			return res.send(403);

		item.remove(function(error){
			if(error)
				res.send(500);
			else
				res.send(200);
		});
	})

};
