
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {});
};


/*
 * GET dashboard.
 */

exports.dashboard = function(req, res){
  res.render('dashboard', {});
};


/*
 * GET invite.
 */

exports.invite = function(req, res){
	var args = require('url').parse(req.url, true).query;
	// console.log(args);
	res.render('invite', args);
};
