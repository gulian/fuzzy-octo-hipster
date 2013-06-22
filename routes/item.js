exports.list = function(req, res){
	req.mongoose.models.item.find(null, function(error, movies){
		res.json(200, movies);
	});
};

exports.details = function(req, res){
	req.mongoose.models.item.find({_id:req.params.id}, function(error, movies){
		// res.json(200, movies);
		res.render('item/details',{layout:'layout/none', movies : movies})
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
	var OperationHelper = require('apac').OperationHelper;
		console.log("kkk");

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
		'ResponseGroup' : 'ItemAttributes,Images,Similarities,RelatedItems,EditorialReview'
	}, function(error, results) {
		if (error)
			return res.send(500);
		if(!results.ItemLookupResponse.Items[0].Item){
			// console.log(results.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0])
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
			ean      : ean,
			user_id  : req.session._id,
			amazon_url : results.ItemLookupResponse.Items[0].Item[0].DetailPageURL[0]
		};
		new req.mongoose.models.item(response).save(function (error, item) {
			if (error)
				res.send(500);
			else{
				// res.json(200, item);
				// var movies = [movie];
				res.render('item/list', {layout:'layout/none', movies :[item]})
			}
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
