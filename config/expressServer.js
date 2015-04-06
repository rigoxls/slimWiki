var env = process.env.NODE_ENV || 'production',
    express = require('express'),
    swig = require('swig'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    middlewares = require('../app/middlewares/admin');

    require('./passportConfig')();

var ExpressServer = function(config){
    config = config || {};

    this.expressServer = express();

    this.expressServer.use(bodyParser.urlencoded({ extended: true}));

    this.expressServer.use(session({
        secret: 'secretpass-session-secret',
        resave: false,
        saveUninitialized: false
    }));

    this.expressServer.use(passport.initialize());
    this.expressServer.use(passport.session());

    //working with middlewares
    for(var middleware in middlewares){
        this.expressServer.use(middlewares[middleware]);
    }

    //tell express we are goind to use swig
    this.expressServer.engine('html', swig.renderFile);
    this.expressServer.set('view engine', 'html');
    swig.setDefaults({ varControls: ['[[', ']]'] });

    //where templates are located
    this.expressServer.set('views', __dirname + '/../app/modules/views/templates');

    if(env == 'development'){
        console.info('dev environment');
        this.expressServer.set('view cache', false);
        swig.setDefaults({cache: false, varControls: ['[[', ']]']});
    }else{
        console.info('this is prod environment');
    }
};

module.exports = ExpressServer;