exports.retreive = function(req, res){

	var request = req.params.id ? { _id : req.params.id } : null ;

	req.mongoose.models.item.find(request).sort({created: -1}).populate('user', 'email').exec(function(error, items){
		res.json(200, items);
	});
};

exports.create = function(req, res){
	req.body.user = req.session._id;
	new req.mongoose.models.item(req.body).save(function (error, item) {
		if (error)
			res.send(500);
		else{
			res.json(200, item);
		}
	});
};

exports.update = function(req, res){
	req.mongoose.models.item.findOne({ _id: req.params.id}, function (error, item) {
		if(error)
			return res.send(500);

		if(item.user != req.session._id)
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

		item.click = (item.click || 0) + 1 ;

		item.save(function(error, item){
			if(error){
				console.log(error);
				return res.send(500);
			}
			return res.json(200, item);
		});
	});
};

exports.delete = function(req,res){
	req.mongoose.models.item.findOne({ _id:req.params.id }, function(error, item){
		if(item && item.user != req.session._id)
			return res.send(403);

		item.remove(function(error){
			if(error)
				res.send(500);
			else
				res.send(200);
		});
	})

};
