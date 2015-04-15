(function(){
    'use strict';

    angular.module('slimWiki.controllers',[])
        .controller('newArticleController', ['$scope', '$http', 'messageFactory', function($scope, $http, messageFactory){

            //set panel
            $scope.panel = "default";

            //if object doesn't exist, create it first time
            $scope.article = $scope.article || {};

            //init visibility
            $scope.article.radioVisibility = 0;

            // function to submit the form after all validation has occurred
            $scope.submitForm = function(isValid) {

                //we need a simple validation to avoid showing invalid messages after save
                $scope.article.validate = true;

                // check to make sure the form is completely valid
                if (isValid) {

                    //create a unique permalink
                    var permalink = $scope.article.title.replace(/\s/g, '_');
                    permalink = permalink.replace(/(\.|\/)/g, '_');
                    permalink = permalink.replace(/\W/g, '') + '_' + Math.floor(Math.random() * 100);

                    //tags
                    var tags = [];
                    if($scope.article.tags.length){
                         tags = $scope.article.tags.map(function(obj){
                            return obj.text;
                        });
                    }

                    var articleContent = {
                        action:       'createArticle',
                        title :       $scope.article.title,
                        description : $scope.article.description,
                        content :     $scope.article.content,
                        visible :     $scope.article.radioVisibility,
                        permalink:    permalink,
                        tags:         tags
                    }

                    $http.post("/dashboard/post/", articleContent)
                        .success(function(data, status, headers, config) {
                           messageFactory.showMessage(data.textResponse, 1);
                           $scope.cleanForm();
                           $scope.article.validate = false;
                        }).
                        error(function(data, status, headers, config) {
                            messageFactory.showMessage(data.textResponse, 2);
                        });
                }
            };

            //clean form
            $scope.cleanForm = function(){
                $scope.article.title = $scope.article.description = $scope.article.content = '';
                $scope.article.tags = [];
            };

            $scope.editorOptions = {
                extraPlugins: 'codesnippet',
                toolbar: [
                    [ 'Source' ], [ 'Undo', 'Redo' ], [ 'Bold', 'Italic', 'Underline', 'Image' ], [ 'CodeSnippet' ]
                ],
                codeSnippet_theme: 'monokai_sublime'
            };

        }])

        .controller('showArticleController', ['$scope', '$http', '$routeParams', '$sce', '$window','$timeout',
            function($scope, $http, $routeParams, $sce, $window, $timeout){

            if(!$routeParams.name){
                //redirect to 404 page TODO
            }

            $scope.article = $scope.article || {};

            var findArticle = {
                action: 'findArticle',
                permalink: $routeParams.name
            };

            $http.post("/dashboard/post/", findArticle)
                .success(function(data, status, headers, config){

                    var article = data.data;

                    $scope.article.name = article.title;
                    $scope.article.content = article.content;
                    $scope.article.tags = article.tags;
                    $scope.article.createdAt = article.created_at;

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

        .controller('listArticleController', ['$scope', '$http', '$routeParams','$window', function($scope, $http, $routeParams, $window){

            $scope.articles = $scope.articles || {};

            var findArticles = {
                action: 'findArticles',
                key: $routeParams.key
            };

            $http.post("/dashboard/post/", findArticles)
                .success(function(data, status, headers, config){
                    console.info(data);
                    $scope.articles = data.data;
                });

            $scope.searchByTag = function(tag){
                $window.location = '/dashboard/#/listArticle/' + tag;
            }
        }])
})();

