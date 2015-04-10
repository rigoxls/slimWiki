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
            templateUrl : '../views/new-article.html',
            controller : 'newArticleController'
        })

        .when('/showArticle/:name',{
            templateUrl : '../views/show-article.html',
            controller : 'showArticleController'
        })

        .otherwise('/',{
            redirectTo : '/'
        })

    }]);

})();