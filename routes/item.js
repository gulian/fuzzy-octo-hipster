
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
			'ItemId'		: ean ,// '3700301024817',
			'IdType'		: 'EAN'
		};

	opHelper.execute('ItemLookup', options, function(error, results) {
		if (error)
			return res.json(500);
		if(!results.ItemLookupResponse.Items[0].Item){
			return res.json(200, {});
		}
		var response = [];
		for (var i = results.ItemLookupResponse.Items[0].Item.length - 1; i >= 0; i--) {
			response.push(results.ItemLookupResponse.Items[0].Item[i].ItemAttributes[0]);
		}
		return res.json(200, response);
	});
};