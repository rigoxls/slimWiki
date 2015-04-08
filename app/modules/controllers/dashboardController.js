var conf = require('../../../config/conf'),
    ArticleModel = require('../models/ArticleModel');

var Dashboard = function(){

    this.model = new ArticleModel();

    this.response = function(action, req, res, next){
        this[action](req, res, next);
    }
};

Dashboard.prototype.newArticle = function(req, res, next){
    var object = {};
    res.render('dashboard', object);
};

Dashboard.prototype.post = function(req, res, next){

    if(!req.body) return false;

    this.model.insert(req.body, function(doc){
        if(doc){
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({value:"saved successfully"}));
        }
    });
};

module.exports = Dashboard;
