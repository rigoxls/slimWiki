(function(){
    'use strict';

    angular.module('slimWiki.controllers',[])
        .controller('upsertArticleController', ['$scope', '$http', '$routeParams', 'messageFactory','CKEditorConfig', function($scope, $http, $routeParams, messageFactory, CKEditorConfig){

            //if object doesn't exist, create it first time
            $scope.article = $scope.article || {};

            var key = $routeParams.permalink || null;

            $scope.pageTitle = (key) ? "Update Article" : "Create Article";;

            //set panel
            $scope.panel = "";

            //if key search article
            if(key){

                var findArticle = {
                    action: 'findArticle',
                    permalink: key
                };

                $http.post("/dashboard/post/", findArticle)
                    .success(function(data, status, headers, config){

                        var article = data.data;

                        $scope.article.title = article.title;
                        $scope.article.description = article.description;
                        $scope.article.content = article.content;
                        $scope.article.tags = article.tags;
                        $scope.article.createdAt = article.created_at;
                        $scope.article.radioVisibility = article.visible == true ? 1 : 0;
                        $scope.article.id = article._id;

                    })
                    .error(function(data, status, headers, config){
                        //redirect to page 404
                        console.info('article not found');
                    });
            }else{
                //init visibility
                $scope.article.radioVisibility = 0;
            }

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

                    //if key update article
                    if(key){
                        articleContent.action = "updateArticle";
                        articleContent.id = $scope.article.id;
                    }

                    $http.post("/dashboard/post/", articleContent)
                        .success(function(data, status, headers, config) {
                           messageFactory.showMessage(data.textResponse, 1);
                           if(!key){
                               $scope.cleanForm();
                           }
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

            $scope.editorOptions = CKEditorConfig.configureCKEditor();

        }])

        .controller('showArticleController', ['$scope', '$http', '$routeParams', '$sce', '$window','$timeout',
            function($scope, $http, $routeParams, $sce, $window, $timeout){

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

                    $scope.article.title = article.title;
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

        .controller('listArticleController', ['$scope', '$http', '$routeParams','$window','messageFactory', function($scope, $http, $routeParams, $window, messageFactory){

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
                $window.location = '/dashboard/#/listArticle/' + tag;
            };

            $scope.searchByPermalink = function(permalink){
                $window.location = '/dashboard/#/showArticle/' + permalink;
            };

            $scope.updateVisibility = function(id, visibility){

                if(id && id.length){

                    var visible = (visibility == false) ? 0 : 1;

                    var articleContent = {
                        action:  "updateArticle",
                        visible: visible,
                        id:      id
                    };

                    $http.post("/dashboard/post/", articleContent)
                        .success(function(data, status, headers, config) {
                           messageFactory.showMessage(data.textResponse, 1);
                        }).
                        error(function(data, status, headers, config) {
                            messageFactory.showMessage('error updating article', 2);
                        });

                }
            };
        }])

        .controller('userProfile',['$rootScope','$scope', '$http','messageFactory', function($rootScope, $scope, $http, messageFactory){

            $scope.user = $scope.user || {};

            $http.post("/dashboard/post/", {action:"findUser"})
                .success(function(data, status, headers, config) {
                   var rUser = data.data;
                   $scope.user.name = rUser.name;
                   $scope.user.email = rUser.email !== 'undefined' ? rUser.email : '';
                   $scope.user.city = rUser.city !== 'undefined' ? rUser.city : '';
                   $scope.user.bio = rUser.bio !== 'undefined' ? rUser.bio : '';
                });


            $scope.submitForm = function(isValid) {
                //if form is valid
                if(isValid){

                    var fileName = null;

                    if($scope.file){
                        fileName = $scope.file.name.replace(/[^a-zA-Z0-9\.]+/g, '-').toLowerCase();
                    }

                    $http({
                        method: 'POST',
                        url: '/dashboard/post/',
                        headers: {
                            'Content-Type' : 'multipart/form-data'
                        },
                        data:{
                            action: 'updateProfile',
                            name: $scope.user.name,
                            email:$scope.user.email,
                            city: $scope.user.city,
                            bio:  $scope.user.bio,
                            file: $scope.file,
                            fileName: fileName
                        },
                        //emulate a post/ multipart data
                        transformRequest: function (data, headersGetter) {
                            var formData = new FormData();
                            angular.forEach(data, function (value, key) {
                                formData.append(key, value);
                            });

                            var headers = headersGetter();
                            delete headers['Content-Type'];

                            return formData;
                        }
                    })
                    .success(function(data){
                        var lUser = data.data;
                        $rootScope.user = $rootScope || {};
                        messageFactory.showMessage(data.textResponse, 1);
                        $rootScope.user.photo = lUser.photo;
                        $rootScope.user.name = lUser.name;
                    })
                    .error(function (data, status) {
                        messageFactory.showMessage('error updating profile', 2);
                    })

                }
            }

        }])

})();

