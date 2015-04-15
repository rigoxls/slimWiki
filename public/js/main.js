(function(){
    'use strict';

    var app = angular.module('slimWiki', [
        'ngSanitize', //to treat html responses that are not safe, use $sce to safe html
        'ngRoute',
        'ngTagsInput',
        'ui.bootstrap',
        'ngCkeditor',
        'slimWiki.controllers',
        'slimWiki.directives',
        'slimWiki.filters',
        'slimWiki.services'
    ]);

    app.config(['$routeProvider', function($routeProvider){
        $routeProvider

        .when('/', {
            templateUrl : '../views/upsert-article.html',
            controller : 'upsertArticleController'
        })

        .when('/showArticle/:permalink',{
            templateUrl : '../views/show-article.html',
            controller : 'showArticleController'
        })

        .when('/listArticle/:key?',{
            templateUrl : '../views/list-article.html',
            controller : 'listArticleController'
        })

        .when('/updateArticle/:permalink',{
            templateUrl: '../views/upsert-article.html',
            controller: 'upsertArticleController'
        })

        .otherwise('/',{
            redirectTo : '/'
        })

    }]);

})();