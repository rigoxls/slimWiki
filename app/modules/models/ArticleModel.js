var modelArticle = require('./schema/articleSchema'),
    modelUser = require('./schema/userSchema'),
    validator = require('validator'),
    mongoose = require('mongoose');

var ArticleModel = function(conf){
    conf = conf || {};
    this.model = modelArticle;
    this.userModel = modelUser;
};

ArticleModel.prototype.insert = function(data, callback){

    var predefinedData = {
        user_id:     data.user._id,
        title:       data.title,
        description: data.description,
        content:     data.content,
        visible:     data.visible,
        permalink:   data.permalink,
        tags:        data.tags
    };

    var cM = new modelArticle(predefinedData);

    cM.save(function(err, data){
        if(err) return console.error(err);
        callback(data);
    });

};

ArticleModel.prototype.update = function(data, callback){
    //this.model.findOneAndUpdate(query, updateDate, options, function(err, doc)
    var articleId = data.id;
    var options = { multi: false, upsert: false };
    var settedValues = {};

    (data.title) ? settedValues.title = data.title : '';
    (data.description) ? settedValues.description = data.description : '';
    (data.content) ? settedValues.content = data.content : '';
    (data.permalink) ? settedValues.permalink = data.permalink : '';
    (data.tags) ? settedValues.tags = data.tags : '';
    (data.deleted) ? settedValues.deleted = data.deleted : '';
    settedValues.visible = (data.visible) ? data.visible : 0;

    this.model.update(
    {
        _id     : articleId,
        user_id : data.user._id //important, just update own article
    },
    {
        $set: settedValues
    }
    ,options,
    function(err, doc){
        callback(doc);
    });
};

ArticleModel.prototype.addComment = function(data, callback){

    var articleId = data.articleId;
    var options = {multi: false, upsert: false };

    this.model.update(
    {
        _id: articleId
    },
    {
        $push: {
            'comments':{
                user: data.user._id,
                comment: validator.escape(data.comment),
                date: Date.now()
            }
        }
    }
    ,options,
    function(err, doc){
        callback(doc)
    })
};

ArticleModel.prototype.findByPermalink = function(data, callback){

    var self = this;
    var query = {
       permalink: data.permalink,
       deleted: false
    };

    if(data.user){
        query.user_id = data.user._id;
    }

    this.model.findOne(
    query,
    function(err, doc){
        if(err) return console.error(err);
            self.userModel.populate(doc, {path:"comments.user"}, function(err, doc){
                callback(doc);
            })
        }
    );
};

ArticleModel.prototype.findByKey = function(data, callback){

    var query = {
        deleted: false,
        $or:
        [
            { title: new RegExp(data.key, 'i') },
            { tags: data.key }
        ]
    };

    if(data.user){
        query.user_id = data.user._id;
    }

    this.model.find(
    query,
    {},
    {
        sort:{
            title : 1
        }
    },
    function(err, doc){
        if(err) return console.error(err);
            callback(doc)
        }
    )
};

module.exports = ArticleModel;
