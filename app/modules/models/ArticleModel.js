var modelArticle = require('./schema/articleSchema'),
    sanitizer = require('sanitizer'),
    mongoose = require('mongoose');

var ArticleModel = function(conf){
    conf = conf || {};
    this.model = modelArticle;
};

ArticleModel.prototype.insert = function(data, callback){

    var predefinedData = {
        user_id:     data.user._id,
        title:       sanitizer.sanitize(data.title),
        description: sanitizer.sanitize(data.description),
        content:     sanitizer.sanitize(data.content),
        visible:     data.visible,
        permalink:   sanitizer.sanitize(data.permalink),
        tags:        data.tags
    };

    var cM = new modelArticle(predefinedData);

    cM.save(function(err, data){
        if(err) return console.error(err);
        callback(data);
    });

};

module.exports = ArticleModel;
