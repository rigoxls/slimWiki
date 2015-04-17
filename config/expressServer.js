var env = process.env.NODE_ENV || 'production',
    express = require('express'),
    swig = require('swig'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    multer  = require('multer'),
    middlewares = require('../app/middlewares/admin');

    require('./passportConfig')();

var ExpressServer = function(config){
    config = config || {};

    this.expressServer = express();

    //Returns middleware that only parses json
    this.expressServer.use( bodyParser.json() );
    //Returns middleware that only parses urlencoded bodies
    this.expressServer.use( bodyParser.urlencoded({ extended: false}) );

    this.expressServer.use(session({
        secret: 'secretpass-session-secret',
        resave: false,
        saveUninitialized: false
    }));

    this.expressServer.use(passport.initialize());
    this.expressServer.use(passport.session());

    this.expressServer.use(multer({
        dest: './public/images/profiles/',
        rename: function(fieldname, filename){
            return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
        }
    }))

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