(function(w){
    'use strict';

    var app = angular.module('slimWiki', [
        'ngSanitize', //to treat html responses that are not safe, use $sce to safe html
        'ngRoute',
        'ui.bootstrap',
        'slimWiki.controllers',
        'slimWiki.directives',
        'slimWiki.filters',
        'slimWiki.services'
    ]);

    app.config(['$routeProvider', function($routeProvider){
        $routeProvider

        .when('/',{
            redirectTo : '/home/'
        })

        .when('/home/:key?', {
            templateUrl : '../views/public-home.html',
            controller : 'homeController'
        })

        .when('/showArticle/:permalink',{
            templateUrl : '../views/show-article.html',
            controller : 'showArticleController'
        })

        .otherwise('/',{
            redirectTo : '/home/'
        })

    }]);

    app.controllers = angular.module('slimWiki.controllers',[]);
    w.slimWiki = app;

})(window);