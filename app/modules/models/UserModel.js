var modelUser = require('./schema/userSchema'),
    mongoose = require('mongoose');

var UserModel = function(conf){
    conf = conf || {};
    this.model = modelUser;
};

UserModel.prototype.findAndUpdate = function(data, callback){

    this.model.findOne({
        provider_id: data.provider_id
    },
    function(err, user){
        if(err) throw(err);

        //if user exists in db , return it
        if(!err && user!=null) return callback(null, user);

        //if user doesn't exist, create it
        var uM = new modelUser(data);

        uM.save(function(err, user){
            if (err) return console.error(err);
            callback(null, user);
        });

    });
};

module.exports = UserModel;
