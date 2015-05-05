var conf = require('../../../config/conf'),
    _ = require('underscore'),
    fs = require('fs'),
    ArticleModel = require('../models/ArticleModel'),
    UserModel = require('../models/UserModel');

var Dashboard = function(){

    this.model = new ArticleModel();
    this.userModel = new UserModel();

    this.response = function(action, req, res, next){
        this[action](req, res, next);
    };

    this.sendResponse = function(res, textResponse, doc, cUser){
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify( {
        textResponse: textResponse,
        data: doc,
        cUser: cUser
      }));
    }
};

Dashboard.prototype.dashboard = function(req, res, next){
    var object = {
        user: req.user
    };
    res.render('dashboard', object);
};

Dashboard.prototype.post = function(req, res, next){
    var self = this;
    if(!req.body) return false;
    if(!req.body.action) return false;

    var data = req.body;
    var action = data.action;
    data.user = req.user;

    if(action === 'createArticle'){
        this.model.insert(data, function(doc){
            if(doc){
                var textResponse = "New article saved successfully";
                self.sendResponse(res, textResponse, doc, data.user);
            }
        });
    }
    else if(action === 'updateArticle'){
        this.model.update(data, function(doc){
            if(doc){
                var textResponse = "Article updated";
                self.sendResponse(res, textResponse, doc, data.user);
            }
        });
    }
    else if(action === 'findArticle'){
        this.model.findByPermalink(data, function(doc){
            if(doc){
                var textResponse = _.isEmpty(doc) ? "No article found" : "article found";
                currentUser = data.user;
                self.sendResponse(res, textResponse, doc, data.user);
            }
        });
    }
    else if(action === 'findArticles'){
        this.model.findByKey(data, function(doc){
            if(doc){
                var textResponse = _.isEmpty(doc) ? "No articles found" : "articles found";
                self.sendResponse(res, textResponse, doc, data.user);
            }
        });
    }

    else if(action === 'updateProfile'){
        var userData = {
            id: data.user._id,
            name: data.name,
            bio: data.bio || '',
            city: data.city || '',
            email: data.email || ''
        };

        //case update profile with profile image
        if(data && data.fileName != 'null' && data.fileName != null){
            var imP = data.fileName;
            var splitImg = imP.split('.');
            var profOldName = conf.imgProf + imP;
            var cleanImgName = splitImg.slice(0,1) + parseInt(Math.random() * 100) + "." + splitImg.slice(1,2);
            var newProfName = conf.imgProf + cleanImgName;

            //rename image just uploaded
            fs.rename(profOldName, newProfName, function(){});
            userData.photo = '../images/profiles/' + cleanImgName;
        }

        //update user profile
        this.userModel.findAndUpdate(userData, function(doc){
            if(doc){
                var textResponse = "User profile updated";
                self.sendResponse(res, textResponse, doc, data.user);
            }
        });
    }

    else if(action === "findUser"){
        var userData = {
            id : data.user._id
        };

        this.userModel.findOne(userData, function(doc){
            if(doc){
                var textResponse = "User gotten";
                self.sendResponse(res, textResponse, doc, data.user);
            }
        });
    }

    else if(action === "saveComment"){
        if(!data.articleId){
           var textResponse = "Article not found";
           self.sendResponse(res, textResponse, {});
        }else{
            this.model.addComment(data, function(doc){
                if(doc){
                    var textResponse = "Comment saved";
                    self.sendResponse(res, textResponse, doc, data.user);
                }
            });
        }
    }

    else if(action === "getComments"){
        if(!data.articleId){
           var textResponse = "Article not found";
           self.sendResponse(res, textResponse, {});
        }else{
            this.model.getComments(data, function(doc){
                if(doc){
                    var textResponse = "Comments returned";
                    self.sendResponse(res, textResponse, doc, data.user);
                }
            });
        }
    }
};

module.exports = Dashboard;
