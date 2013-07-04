exports.retreive = function(req, res){
	req.mongoose.models.item.find({user_id : req.session._id}, function(error, items){
		res.json(200, items);
	});
};

exports.create = function(req, res){
	req.mongoose.models.item.find({ ean:req.body.ean, user_id : req.session._id },function(error, items){
		if(error || items.length > 0){
			return res.send(412);
		}
		req.body.user_id = req.session._id;
		new req.mongoose.models.item(req.body).save(function (error, item) {
			if (error)
				res.send(500);
			else{
				res.json(200, item);
			}
		});
	});
};

exports.update = function(req, res){
	req.mongoose.models.item.findOne({ _id: req.params.id}, function (error, item) {
		if(error)
			return res.send(500);

		item.title =  req.body.title;
		item.actors =  req.body.actors;
		item.directors =  req.body.directors;
		item.year =  req.body.year;

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
	req.mongoose.models.item.find({ _id:req.params.id }).remove(function(error, removed){
		if(removed > 0)
			res.send(200);
		else
			res.send(404);//give UI information
	});
};
