exports.list = function(req, res){
	req.mongoose.models.item.find(null, function(error, movies){
		res.json(200, movies);
	});
};

exports.details = function(req, res){
	req.mongoose.models.item.find({_id:req.params.id}, function(error, movies){
		res.render('item/details',{layout:'layout/none', movies : movies});
	});
};

exports.add = function(req, res){
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

exports.add_ean = function(req, res){
	var ean = req.params.ean;
	if(!ean)
		return res.json(200, {});


	new req.OperationHelper(req.amazon_credentials).execute('ItemLookup', {
		'SearchIndex'	: 'Video',
		'ItemId'		:  ean ,
		'IdType'		: 'EAN',
		'ResponseGroup' : 'ItemAttributes,Images'
	}, function(error, results) {

		if (error || results.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0])
			return res.send(500);
		if(!results.ItemLookupResponse.Items[0].Item)
			return res.json(200, {});

		var item = exports.result_to_item(results);

		item.ean		= ean;
		item.user_id	= req.session._id;

		new req.mongoose.models.item(item).save(function(error, item){
			if (error)
				return res.send(500);
			else{
				return res.render('item/list', {layout:'layout/none', movies :[item]});
			}
		});
	});
};



exports.import_eans = function(req, res){

	if(!req.session._id)
		return res.send(403);

	var eans = req.params.eans.split(','),
		ean  = eans[0];


	if( ean.length !== 13){
		if(eans.length === 1)
			return res.send(200);
		else {
			req.params.eans = eans.slice(1).join(',');
			return exports.import_eans(req, res);
		}
	}

	new req.OperationHelper(req.amazon_credentials).execute('ItemLookup', {
		'SearchIndex'	: 'Video',
		'ItemId'		:  ean ,
		'IdType'		: 'EAN',
		'ResponseGroup' : 'ItemAttributes,Images'
	}, function(error, results) {

		if (error || results.ItemLookupResponse.Items[0].Request[0].Errors)
			return res.send(500);

		if(!results.ItemLookupResponse.Items[0].Item){
			if(eans.length === 1)
				return res.send(200);
			else {
				req.params.eans = eans.slice(1).join(',');
				return exports.import_eans(req, res);
			}
		}

		var item = exports.result_to_item(results);

		item.ean		= ean;
		item.user_id	= req.session._id;

		new req.mongoose.models.item(item).save(function(error, item){
			if(eans.length === 1)
				return res.send(200);
			else {
				console.log(item.title, 'saved');
				req.params.eans = eans.slice(1).join(',');
				return exports.import_eans(req, res);
			}
		});
	});
};

exports.result_to_item = function(results){
	var item     = results.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0],
		imageSet = results.ItemLookupResponse.Items[0].Item[0].ImageSets[0].ImageSet[0],
		response = {
			title    : item.Title[0],
			image    : imageSet.LargeImage[0].URL[0],
			thumbnail: imageSet.ThumbnailImage[0].URL[0],
			directors: item.Director,
			actors   : item.Actor,
			amazon_url : results.ItemLookupResponse.Items[0].Item[0].DetailPageURL[0]
		};

	if(item.ReleaseDate)
		response.year = item.ReleaseDate[0].substr(0, 4);

	return response;
};

exports.delete = function(req,res){
	req.mongoose.models.item.find({ _id:req.params.id }).remove(function(error, removed){
		if(removed > 0)
			res.send(200);
		else
			res.send(404);//give UI information
	});
};


exports.search = function(req, res){
	var ean = req.params.ean;

	if(!ean)
		return res.json(200, {});

	var OperationHelper = require('apac').OperationHelper;

	OperationHelper.version = '2010-11-01';
	OperationHelper.service = 'AWSECommerceService';
	OperationHelper.defaultEndPoint = 'ecs.amazonaws.fr';
	OperationHelper.defaultBaseUri = '/onca/xml';

	var Amazon = new OperationHelper({
			awsId    : 'AKIAJCMDUTSHKJAM423A',
			awsSecret: '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',
			assocId  : 'gulianfr-20'
		});

	Amazon.execute('ItemLookup', {
		'SearchIndex'	: 'Video',
		'ItemId'		: ean ,
		'IdType'		: 'EAN',
		'ResponseGroup' : 'ItemAttributes,Images'
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
