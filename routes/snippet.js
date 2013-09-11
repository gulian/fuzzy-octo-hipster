exports.retreive = function(req, res){

    var request = req.params.id ? { _id : req.params.id } : null ;

    req.mongoose.models.snippet.find(request).sort({created: -1}).populate('user', 'email').populate('comments').exec(function(error, snippets){

        req.mongoose.models.user.populate(snippets, {
            path: 'comments.user',
            select: 'email'
        }, function(error, snippets){
            res.json(200, snippets);
        });

    });
};

exports.create = function(req, res){

    req.body.user = req.session._id;

    if(!req.body.user)
        return res.send(403);


    if(!req.body.tags)
        req.body.tags = [];
    else if(typeof req.body.tags === "string"){
        var tmp = [];
        for (var i = 0; i < req.body.tags.split(',').length; i++) {
            tmp.push({
                name: req.body.tags.split(',')[i]
            });
        }
        req.body.tags = tmp;
    }

    new req.mongoose.models.snippet(req.body).save(function (error, snippet) {
        if (error)
            res.send(500);
        else{
            req.mongoose.models.user.populate(snippet, {
                path: 'user',
                select: 'email'
            }, function(error, snippet){
                if (error)
                    return res.send(500);
                else
                    res.json(200, snippet);
            });
        }
    });
};

exports.update = function(req, res){
    req.mongoose.models.snippet.findOne({ _id: req.params.id}, function (error, snippet) {
        if(error)
            return res.send(500);

        if(snippet && snippet.user != req.session._id && snippet.user !== undefined)
            return res.send(403);

        snippet.title   =  req.body.title;
        snippet.tags    =  req.body.tags;
        snippet.created = Date.now();

        snippet.save(function(error, snippet){
            if(error){
                console.log(error);
                return res.send(500);
            }
            return res.json(200, snippet);
        });
    });
};

exports.updateClick = function(req, res){
    req.mongoose.models.snippet.findOne({ _id: req.params.id}, function (error, snippet) {
        if(error)
            return res.send(500);

        req.mongoose.models.user.findOne({ _id: req.session._id}, function (error, user) {
            if(error)
                return res.send(500);

            if(snippet.click.indexOf(user.email) === -1 )
                snippet.click.push(user.email);

            snippet.save(function(error, snippet){
                if(error){
                    console.log(error);
                    return res.send(500);
                }
                return res.json(200, snippet);
            });
        });
    });
};

exports.delete = function(req,res){
    req.mongoose.models.snippet.findOne({ _id:req.params.id }, function(error, snippet){
        if(snippet && snippet.user != req.session._id && snippet.user !== undefined)
            return res.send(403);

        snippet.remove(function(error){
            if(error)
                res.send(500);
            else
                res.send(200);
        });
    });
};
