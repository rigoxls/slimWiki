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

    var data = req.body;
    data.user = req.user;

    this.model.insert(data, function(doc){
        if(doc){
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify( {
            textResponse: "New article saved successfully",
            data: doc
          }));
        }
    });
};

module.exports = Dashboard;
