(function(){
    'use strict';

    angular.module('slimWiki.public_controllers',[])

        .controller('homeController', ['$scope', '$http', '$routeParams','$window', function($scope, $http, $routeParams, $window){

            $scope.articles = $scope.articles || {};

            var findArticles = {
                action: 'findArticles',
                key: $routeParams.key
            };

            $http.post("/dashboard/post/", findArticles)
                .success(function(data, status, headers, config){
                    $scope.articles = data.data;
                    if(!$scope.articles.length){
                        $scope.articles.none = true;
                    }
                });

            $scope.searchByTag = function(tag){
                $window.location = '/#/home/' + tag;
            };

            $scope.searchByPermalink = function(permalink){
                console.info(permalink);
                $window.location = '/#/showArticle/' + permalink;
            };

        }])

        .controller('showArticleController', ['$scope', '$rootScope', '$http', '$routeParams', '$sce', '$window','$timeout',
            function($scope, $rootScope, $http, $routeParams, $sce, $window, $timeout){

            if(!$routeParams.permalink){
                //redirect to 404 page TODO
            }

            $scope.article = $scope.article || {};

            var findArticle = {
                action: 'findArticle',
                permalink: $routeParams.permalink
            };

            $http.post("/dashboard/post/", findArticle)
                .success(function(data, status, headers, config){

                    var article = data.data;

                    $scope.article.id = article._id;
                    $scope.article.permalink = article.permalink;
                    $scope.article.title = article.title;
                    $scope.article.content = article.content;
                    $scope.article.tags = article.tags;
                    $scope.article.createdAt = article.created_at;
                    $scope.currentUser = data.cUser || null;
                    $scope.author = article.user_id;

                    console.info($scope.author);

                })
                .error(function(data, status, headers, config){
                    //redirect to page 404
                    console.info('article not found');
                });

            $scope.setHighlighting = function(){
                $timeout(function(){
                    $window.hljs.initHighlighting();
                },200);
            };

            //sintax highlight
            $scope.setHighlighting();

        }])

})();

