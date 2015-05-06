var controllersManager = require('./app/modules/controllers/controllersManager'),
    conf = require('./config/conf'),
    passport = require('passport');


var Routes = function(app){
    var controllers = [];

    for(var cm in controllersManager){
        controllers[cm] = new controllersManager[cm];
    };

    app.expressServer.get('/', function(req, res, next){
        controllers['homeController'].response('home', req, res, next);
    });

    app.expressServer.get('/login', function(req, res, next){
        controllers['homeController'].response('home', req, res, next);
    });

    app.expressServer.get('/home', function(req, res, next){
        controllers['homeController'].response('home', req, res, next);
    });

    //dahsboard is our main route, this route lets angularjs interect with its routes
    app.expressServer.get('/dashboard', function(req, res, next){
        //not user, redirect
        if(!req.user) res.redirect('/home');
        controllers['dashboardController'].response('dashboard', req, res, next);
    });

    //to deal all post actions
    app.expressServer.post('/dashboard/post/', function(req, res, next){
        controllers['dashboardController'].response('post', req, res, next);
    });

    app.expressServer.get('/logout/', function(req, res, next){
        req.logout();
        res.redirect('/home');
    });

    //redirect the user to twitter for authentication. when complete, twitter
    //will redirect the user back to the application at
    // /auth/twitter/callback
    app.expressServer.get('/auth/twitter', passport.authenticate('twitter'));

    //twitter will redirect the user to this URL  after approval. Finish the
    //authentication process by attempting to obtain an access token.
    //If access was granted, the user will be logged in . Otherwise, authentication has failed.
    app.expressServer.get('/auth/twitter/callback',
        passport.authenticate('twitter', { successRedirect: conf.appUrl + 'dashboard/#/',
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
      passport.authenticate('facebook', { successRedirect: conf.appUrl + 'dashboard/#/',
                                          failureRedirect: '/login' }));
}

module.exports = Routes;