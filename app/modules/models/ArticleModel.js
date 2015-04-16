var modelArticle = require('./schema/articleSchema'),
    mongoose = require('mongoose');

var ArticleModel = function(conf){
    conf = conf || {};
    this.model = modelArticle;
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
    var id = data.id;
    var options = { multi: false, upsert: false };
    var settedValues = {};

    (data.title) ? settedValues.title = data.title : '';
    (data.description) ? settedValues.description = data.description : '';
    (data.content) ? settedValues.content = data.content : '';
    (data.permalink) ? settedValues.permalink = data.permalink : '';
    (data.tags) ? settedValues.tags = data.tags : '';
    settedValues.visible = (data.visible) ? data.visible : 0;

    this.model.update(
    {
        _id: data.id
    },
    {
        $set: settedValues
    }
    ,options,
    function(err, doc){
        callback(doc);
    });
}

ArticleModel.prototype.findByPermalink = function(data, callback){
    this.model.find(
    {
       permalink: data.permalink
    },
    function(err, doc){
        if(err) return console.error(err);
           callback(doc);
        }
    );
};

ArticleModel.prototype.findByKey = function(data, callback){
    this.model.find(
    {
        $or:
        [
            { title: new RegExp(data.key, 'i') },
            { tags: data.key }
        ]
    },
    function(err, doc){
        if(err) return console.error(err);
            callback(doc)
        }
    )
};

module.exports = ArticleModel;
