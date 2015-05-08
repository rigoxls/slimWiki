var conf = require('../../../config/conf'),
    dbService = require('../services/dbService');

var Dashboard = function(){
    this.dbService = new dbService();

    this.response = function(action, req, res, next){
        this[action](req, res, next);
    };

    this.sendResponse = function(res, textResponse, doc, cUser){
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify( {
        textResponse: textResponse,
        data: doc,
        cUser: cUser
      }));
    }
};

Dashboard.prototype.dashboard = function(req, res, next){
    var topics = [];

    this.dbService['getTopics']({}, function(resData){
        if(resData){
            topics = resData.doc;
            var object = {
                user: req.user,
                topics: topics
            };
            console.info(object);
            res.render('dashboard', object);
        }else{
            console.log('something wrong has happened, calling the service !');
        }
    });
};

Dashboard.prototype.post = function(req, res, next){
    var self = this;
    if(!req.body) return false;
    if(!req.body.action) return false;

    var data = req.body;
    var action = data.action;
    data.user = req.user;

    if(this.dbService[action]){
        this.dbService[action](data, function(resData){
            if(resData){
                self.sendResponse(res, resData.textResponse, resData.doc, data.user);
            }else{
                console.log('something wrong has happened, calling the service !');
            }
        });
    }else{
        console.log('Oopss action service is not valid !');
    }
};

module.exports = Dashboard;
