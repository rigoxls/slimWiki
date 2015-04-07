var conf = require('../../../config/conf'),
           UserModel = require('../models/UserModel');

var Home = function(){
    this.model = new UserModel();

    this.response = function(action, req, res, next){
        this[action](req, res, next);
    }
};

Home.prototype.home = function(req, res, next){
    var object = {};
    res.render('home', object);
}

module.exports = Home;