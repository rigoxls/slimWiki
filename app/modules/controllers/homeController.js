var conf = require('../../../config/conf'),
           dbService = require('../services/dbService');

var Home = function(){
    this.dbService = new dbService();

    this.response = function(action, req, res, next){
        this[action](req, res, next);
    }
};

Home.prototype.home = function(req, res, next){

    var topics = [];

    this.dbService['getTopics']({}, function(resData){
        if(resData){
            topics = resData.doc;
            var object = {
                user: req.user,
                topics: topics
            };
            res.render('home', object);
        }else{
            console.log('something wrong has happened, calling the service !');
        }
    });
}

module.exports = Home;