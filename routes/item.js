exports.retreive = function(req, res){

	var request = req.params.id ? { _id : req.params.id } : null ;

	req.mongoose.models.item.find(request, function(error, items){
		res.json(200, items);
	});
};

exports.create = function(req, res){
	req.body.user_id = req.session._id;
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

		item.title =  req.body.title;
		item.actors =  req.body.url;

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
