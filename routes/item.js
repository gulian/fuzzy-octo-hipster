
/*
 * GET items listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.search = function(req, res){
	// var args = require('url').parse(req.url, true).query;
	var ean = req.params.ean;

	if(!ean)
		return res.json(200, {});

	var util = require('util'),
		OperationHelper = require('apac').OperationHelper;

	var opHelper = new OperationHelper({
		awsId:     '',
		awsSecret: '',
		assocId:   'gulianfr-20'
	});

	var options = {
			'SearchIndex'	: 'Video',
			'ItemId'		: ean ,
			'IdType'		: 'EAN',
			'ResponseGroup': 'ItemAttributes,Images'
		};

	try {
		opHelper.execute('ItemLookup', options, function(error, results) {
			if (error)
				return res.send(500);
			if(!results.ItemLookupResponse.Items[0].Item){
				return res.json(200, {});
			}
			var item =  results.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0];
			var response = {
				title		: item.Title[0],
				image		: results.ItemLookupResponse.Items[0].Item[0].ImageSets[0].ImageSet[0].LargeImage[0].URL[0],
				thumbnail	: results.ItemLookupResponse.Items[0].Item[0].ImageSets[0].ImageSet[0].ThumbnailImage[0].URL[0],
				director	: item.Director,
				actors		: item.Actor,
				year        : item.ReleaseDate[0].substr(0, 4)
			};
			console.log(item)
			return res.json(200, response);
		});
	} catch (error){
		return res.send(500);
	}
};
