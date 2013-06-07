exports.list = function(req, res){
	req.mongoose.models.item.find(null, function(error, movies){
		res.json(200, movies);
	});
};

exports.library = function(req, res){
	req.mongoose.models.item.find(null, function(error, movies){
		res.render('library', {movies:movies});
	});
};

exports.add = function(req, res){
	req.mongoose.models.item.find({ ean:req.body.ean },function(error, movies){
		if(error || movies.length > 0){
			return res.send(412);
		}
		new req.mongoose.models.item(req.body).save(function (error, movie) {
			if (error)
				res.send(500);
			else{
				res.json(200, movie);
			}
		});
	});
};

exports.delete = function(req,res){
	req.mongoose.models.item.find({ _id:req.body._id }).remove(function(error, removed){
		if(removed > 0)
			res.send(200);
		else
			res.send(404);
	});
};

exports.search = function(req, res){
	var ean = req.params.ean;

	if(!ean)
		return res.json(200, {});

	var OperationHelper = require('apac').OperationHelper,
		Amazon = new OperationHelper({
			awsId    : 'AKIAJCMDUTSHKJAM423A',
			awsSecret: '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',
			assocId  : 'gulianfr-20'
		});

	Amazon.execute('ItemLookup', {
		'SearchIndex'	: 'Video',
		'ItemId'		: ean ,
		'IdType'		: 'EAN',
		'ResponseGroup': 'ItemAttributes,Images'
	}, function(error, results) {
		if (error)
			return res.send(500);
		if(!results.ItemLookupResponse.Items[0].Item){
			return res.json(200, {});
		}
		var item =  results.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0];
		var response = {
			title    : item.Title[0],
			image    : results.ItemLookupResponse.Items[0].Item[0].ImageSets[0].ImageSet[0].LargeImage[0].URL[0],
			thumbnail: results.ItemLookupResponse.Items[0].Item[0].ImageSets[0].ImageSet[0].ThumbnailImage[0].URL[0],
			directors: item.Director,
			actors   : item.Actor,
			year     : item.ReleaseDate[0].substr(0, 4),
			ean      : ean
		};
		return res.json(200, response);
	});
};
