var conf = require('../../../config/conf');

var Content = function(){
    this.response = function(action, req, res, next){
        this[action](req, res, next);
    }
};

Content.prototype.newPost = function(req, res, next){
    res.send('you are in newPost');
};

module.exports = Content;
