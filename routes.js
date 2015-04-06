var controllersManager = require('./app/modules/controllers/controllersManager'),
    passport = require('passport');


var Routes = function(app){
    var controllers = [];

    for(var cm in controllersManager){
        controllers[cm] = new controllersManager[cm];
    };

    app.expressServer.get('/', function(req, res, next){
        res.send('you are in / as logged');
    });

    app.expressServer.get('/login', function(req, res, next){
        res.send('you are in login');
    });

    app.expressServer.get('/home', function(req, res, next){
        controllers['homeController'].response('home', req, res, next);
    });

    //redirect the user to twitter for authentication. when complete, twitter
    //will redirect the user back to the application at
    // /auth/twitter/callback
    app.expressServer.get('/auth/twitter', passport.authenticate('twitter'));

    //twitter will redirect the user to this URL  after approval. Finish the
    //authentication process by attempting to obtain an access token.
    //If access was granted, the user will be logged in . Otherwise, authentication has failed.
    app.expressServer.get('/auth/twitter/callback',
        passport.authenticate('twitter', { successRedirect: 'http://localhost:5000/home',
                                           failureRedirect: '/login' } ));

    // Redirect the user to Facebook for authentication.  When complete,
    // Facebook will redirect the user back to the application at
    //     /auth/facebook/callback
    app.expressServer.get('/auth/facebook', passport.authenticate('facebook'));

    // Facebook will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    app.expressServer.get('/auth/facebook/callback',
      passport.authenticate('facebook', { successRedirect: 'http://localhost:5000/home',
                                          failureRedirect: '/login' }));
}

module.exports = Routes;