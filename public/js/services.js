(function(){
    angular.module('slimWiki.services', [])

        .factory('slimWikiService',['$http', '$q', function($http, $q){
            var factory = {};

            factory.getComments = function(permalink){
                var deferred = $q.defer();
                var promise = deferred.promise;
                var cObject = {};

                cObject.action = 'findArticle';
                cObject.permalink = permalink;

                $http.post('/dashboard/post/', cObject)
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(e){
                        deferred.reject(e);
                    });

                return promise;
            };

            factory.saveComment = function(comment){
                var deferred = $q.defer();
                var promise = deferred.promise;

                comment.action = "saveComment";

                $http.post('/dashboard/post/', comment)
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(e){
                        deferred.reject(e);
                    });

                return promise;
            };

            factory.removeComment = function(articleId, commentId){
                var deferred = $q.defer();
                var promise = deferred.promise;
                var comment = {};

                comment.commentId = commentId;
                comment.articleId = articleId;
                comment.action = "removeComment";

                $http.post('/dashboard/post/', comment)
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(e){
                        deferred.reject(e);
                    });

                return promise;
            };

            return factory;

        }])

        .factory('messageFactory', ['$timeout', '$rootScope', '$window', function($timeout, $rootScope, $window){
            var factory = {};
            $rootScope.alertMessage = null;
            $rootScope.alertShow = false;

            factory.showMessage = function(msg, type){

                var type = parseInt(type, 10);
                var typeMessage = 'alert-info';

                if(type === 1){
                    typeMessage = 'alert-success';
                }else if(type === 2){
                    typeMessage = 'alert-danger';
                }

                $rootScope.alertMessage = msg;
                $rootScope.alertShow = true;
                $rootScope.alertType = typeMessage;

                $window.scrollTo(0,0);

                $timeout(function(){
                    factory.hideMessage();
                },5000)
            };

            factory.hideMessage = function(){
                $rootScope.alertShow = false;
            };

            return factory;
        }])

        .factory('CKEditorConfig',[function(){

            var factory = {};

            factory.configureCKEditor = function(){
                return {
                    extraPlugins: 'codesnippet',
                    toolbar: [
                        [ 'Source' ], [ 'Undo', 'Redo' ], [ 'Bold', 'Italic', 'Underline', 'Image' ], [ 'CodeSnippet' ]
                    ],
                    codeSnippet_theme: 'monokai_sublime'
                };
            };

            return factory;
        }])

})();