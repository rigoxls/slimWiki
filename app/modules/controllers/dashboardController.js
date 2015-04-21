var conf = require('../../../config/conf'),
    _ = require('underscore'),
    fs = require('fs'),
    ArticleModel = require('../models/ArticleModel');

var Dashboard = function(){

    this.model = new ArticleModel();

    this.response = function(action, req, res, next){
        this[action](req, res, next);
    }
};

Dashboard.prototype.dashboard = function(req, res, next){
    var object = {
        user: req.user
    };
    res.render('dashboard', object);
};

Dashboard.prototype.post = function(req, res, next){
    if(!req.body) return false;
    if(!req.body.action) return false;

    var data = req.body;
    var action = data.action;
    data.user = req.user;

    if(action === 'createArticle'){
        this.model.insert(data, function(doc){
            if(doc){
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify( {
                textResponse: "New article saved successfully",
                data: doc
              }));
            }
        });
    }
    else if(action === 'updateArticle'){
        this.model.update(data, function(doc){
            if(doc){
                res.setHeader('Content-type', 'application/json');
                res.end(JSON.stringify({
                    textResponse: "Article updated",
                    data: doc
                }))
            }
        });
    }
    else if(action === 'findArticle'){
        this.model.findByPermalink(data, function(doc){
            if(doc){
                res.setHeader('Content-type', 'application/json');
                res.end(JSON.stringify({
                    textResponse: _.isEmpty(doc) ? "no article found" : "articles found",
                    data: doc[0]
                }));
            }
        });
    }
    else if(action === 'findArticles'){
        this.model.findByKey(data, function(doc){
            if(doc){
                res.setHeader('Content-type','application/json');
                res.end(JSON.stringify({
                    textResponse: _.isEmpty(doc) ? "no articles found" : "articles found",
                    data: doc
                }));
            }
        });
    }

    else if(action === 'updateProfile'){
        console.info(data);

        //case update profile with profile image
        if(data && data.fileName){
            var imP = data.fileName;
            var splitImg = imP.split('.');
            var profOldName = conf.imgProf + imP;
            var newProfName = conf.imgProf + splitImg.slice(0,1) + parseInt(Math.random() * 100) + "." + splitImg.slice(1,2);

            //rename image just uploaded
            fs.rename(profOldName, newProfName, function(){});
        }
    }
};

module.exports = Dashboard;
