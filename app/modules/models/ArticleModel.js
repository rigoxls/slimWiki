var modelArticle = require('./schema/articleSchema'),
    mongoose = require('mongoose');

var ArticleModel = function(conf){
    conf = conf || {};
    this.model = modelArticle;
};

ArticleModel.prototype.insert = function(data, callback){

    var predefinedData = {
        user_id: data.user._id,
        title: data.title,
        description: data.description,
        content: data.content,
        visible: data.visible,
        permalink: data.permalink
    };

    var cM = new modelArticle(predefinedData);

    cM.save(function(err, data){
        if(err) return console.error(err);
        callback(data);
    });

};

module.exports = ArticleModel;
