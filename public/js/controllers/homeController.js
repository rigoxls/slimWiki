(function(w){
    'use-strict';

    w.slimWiki.controllers.controller('homeController', ['$scope', '$http', '$routeParams','$window', function($scope, $http, $routeParams, $window){

        $scope.articles = $scope.articles || {};

        var findArticles = {
            action: 'findArticles',
            allArticles: true,
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

})(window);