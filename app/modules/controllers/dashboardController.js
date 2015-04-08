var conf = require('../../../config/conf');

var Dashboard = function(){
    this.response = function(action, req, res, next){
        this[action](req, res, next);
    }
};

Dashboard.prototype.newArticle = function(req, res, next){
    var object = {};
    res.render('dashboard', object);
};

module.exports = Dashboard;
