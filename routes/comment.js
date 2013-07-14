exports.create = function(req, res){

	req.body.user = req.session._id;

	if(!req.body.user)
		return res.send(403);

	new req.mongoose.models.comment(req.body).save(function (error, comment) {
		if (error)
			res.send(500);
		else{

			req.mongoose.models.item.findOne({ _id: req.body.item}, function (error, item) {
				if(error)
					return res.send(500);

				if(!item.comments)
					item.comments = [];

				item.comments.push(comment._id);

				item.save(function(error, item){
					if(error){
						console.log(error);
						return res.send(500);
					}

					req.mongoose.models.user.populate(comment, {
						path: 'user',
						select: 'email'
					}, function(error, comment){
						res.json(200, comment);
					});

				});
			});
		}
	});
};

exports.delete = function(req,res){
	req.mongoose.models.comment.findOne({ _id:req.params.id }, function(error, comment){
		if(comment && comment.user != req.session._id && comment.user !== undefined)
			return res.send(403);

		comment.remove(function(error){
			if(error)
				res.send(500);
			else
				res.send(200);
		});
	});
};
