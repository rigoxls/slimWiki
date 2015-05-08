(function(w){
    'use-strict';

    w.slimWiki.controllers.controller('listArticleController', ['$scope', '$http', '$routeParams','$window', '$modal', 'messageFactory', function($scope, $http, $routeParams, $window, $modal, messageFactory){

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

        //ui-modal delete article
        $scope.open = function(size, article){
            var modalInstance = $modal.open({
                templateUrl: '../partials/modal.html',
                controller: 'deleteArticleModal',
                size: size,
                resolve: {
                    params: function() {
                        return {
                            modalTitle: 'Are you sure to delete this article ?',
                            article: article
                        }
                    }
                }
            });

            modalInstance.result.then(function(){  /*closed*/ }, function(){ /*dismissed*/ });
        }
    }])

})(window);