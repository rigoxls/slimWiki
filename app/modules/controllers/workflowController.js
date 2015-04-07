var conf = require('../../../config/conf');

var Workflow = function(){
    this.response = function(action, req, res, next){
        this[action](req, res, next);
    }
};

Workflow.prototype.dashboard = function(req, res, next){
    var object = {};
    res.render('dashboard', object);
};

module.exports = Workflow;
