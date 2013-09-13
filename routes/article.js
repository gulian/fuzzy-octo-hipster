exports.retreive = function(req, res){

    var request = req.params.id ? { _id : req.params.id } : null ;

    req.mongoose.models.article.find(request).sort({created: -1}).populate('user', 'email').populate('comments').exec(function(error, articles){

        req.mongoose.models.user.populate(articles, {
            path: 'comments.user',
            select: 'email'
        }, function(error, articles){
            res.json(200, articles);
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

    new req.mongoose.models.article(req.body).save(function (error, article) {
        if (error)
            res.send(500);
        else{
            req.mongoose.models.user.populate(article, {
                path: 'user',
                select: 'email'
            }, function(error, article){
                if (error)
                    return res.send(500);
                else
                    res.json(200, article);
            });
        }
    });
};

exports.update = function(req, res){
    req.mongoose.models.article.findOne({ _id: req.params.id}, function (error, article) {
        if(error)
            return res.send(500);

        if(article && article.user != req.session._id && article.user !== undefined)
            return res.send(403);

        article.title   =  req.body.title;
        article.tags    =  req.body.tags;
        article.created = Date.now();

        article.save(function(error, article){
            if(error){
                console.log(error);
                return res.send(500);
            }
            return res.json(200, article);
        });
    });
};

exports.updateClick = function(req, res){
    req.mongoose.models.article.findOne({ _id: req.params.id}, function (error, article) {
        if(error)
            return res.send(500);

        req.mongoose.models.user.findOne({ _id: req.session._id}, function (error, user) {
            if(error)
                return res.send(500);

            if(article.click.indexOf(user.email) === -1 )
                article.click.push(user.email);

            article.save(function(error, article){
                if(error){
                    console.log(error);
                    return res.send(500);
                }
                return res.json(200, article);
            });
        });
    });
};

exports.delete = function(req,res){
    req.mongoose.models.article.findOne({ _id:req.params.id }, function(error, article){
        if(article && article.user != req.session._id && article.user !== undefined)
            return res.send(403);

        article.remove(function(error){
            if(error)
                res.send(500);
            else
                res.send(200);
        });
    });
};
