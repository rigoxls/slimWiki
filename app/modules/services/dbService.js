var conf = require('../../../config/conf'),
    _ = require('underscore'),
    ArticleModel = require('../models/ArticleModel'),
    UserModel = require('../models/UserModel'),
    fs = require('fs');

var DbService = function(){
    this.articleModel = new ArticleModel();
    this.userModel = new UserModel();
};

DbService.prototype.createArticle = function(data, callback){
    this.articleModel.insert(data, function(doc){
        if(doc){
            var textResponse = "New article saved successfully";
            callback({ doc: doc, textResponse: textResponse});
        }else{
            callback(null);
        }
    });
};

DbService.prototype.updateArticle = function(data, callback){
    this.articleModel.update(data, function(doc){
        if(doc){
            var textResponse = "Article updated";
            callback({ doc: doc, textResponse: textResponse});
        }else{
            callback(null);
        }
    });
};

DbService.prototype.findArticle = function(data, callback){
    this.articleModel.findByPermalink(data, function(doc){
        if(doc){
            var textResponse = _.isEmpty(doc) ? "No article found" : "article found";
            currentUser = data.user;
            callback({ doc: doc, textResponse: textResponse});
        }else{
            callback(null);
        }
    });
};

DbService.prototype.findArticles = function(data, callback){
    this.articleModel.findByKey(data, function(doc){
        if(doc){
            var textResponse = _.isEmpty(doc) ? "No articles found" : "articles found";
            callback({ doc: doc, textResponse: textResponse});
        }else{
            callback(null);
        }
    });
};

DbService.prototype.getTopics = function(data, callback){
    this.articleModel.getTopics(data, function(doc){
        if(doc){
            var textResponse = _.isEmpty(doc) ? "No topics found" : "Topics found";
            callback({ doc: doc, textResponse: textResponse});
        }else{
            callback(null);
        }
    })
};

DbService.prototype.updateProfile = function(data, callback){
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
            callback({ doc: doc, textResponse: textResponse});
        }else{
            callback(null);
        }
    });
};

DbService.prototype.findUser = function(data, callback){
    var userData = {
        id : data.user._id
    };

    this.userModel.findOne(userData, function(doc){
        if(doc){
            var textResponse = "User gotten";
            callback({ doc: doc, textResponse: textResponse});
        }else{
            callback(null);
        }
    });
};

DbService.prototype.saveComment = function(data, callback){
    if(!data.articleId){
       var textResponse = "Article not found";
       self.sendResponse(res, textResponse, {});
    }else{
        this.articleModel.addComment(data, function(doc){
            if(doc){
                var textResponse = "Comment saved";
                callback({ doc: doc, textResponse: textResponse});
            }else{
                callback(null);
            }
        });
    }
};

DbService.prototype.getComments = function(data, callback){
    if(!data.articleId){
       var textResponse = "Article not found";
       self.sendResponse(res, textResponse, {});
    }else{
        this.articleModel.getComments(data, function(doc){
            if(doc){
                var textResponse = "Comments returned";
                callback({ doc: doc, textResponse: textResponse});
            }else{
                callback(null);
            }
        });
    }
};

DbService.prototype.removeComment = function(data, callback){
    if(data.articleId){
        this.articleModel.removeComment(data, function(doc){
            if(doc){
                var textResponse = "comment Deleted";
                callback({ doc: doc, textResponse: textResponse});
            }else{
                callback(null);
            }
        })
    }else{
        callback(null);
    }
};

DbService.prototype.getAuthor = function(data, callback){
    if(data.authorId){
        this.userModel.getAuthor(data, function(doc){
            if(doc){
                var textResponse = "Author gotten";
                callback({ doc: doc, textResponse: textResponse});
            }else{
                callback(null);
            }
        });
    }else{
        callback(null);
    }
};

module.exports = DbService;