(function(w){
    'use-strict';

    w.slimWiki.controllers.controller('showAuthorController', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams){

        var authorId = $routeParams.id || null;

        if(!authorId){
            w.location.href = /home/;
        }

        var authorContent = {
            authorId: authorId,
            action: 'getAuthor'
        };

        $http.post("/dashboard/post/", authorContent)
            .success(function(data, status, headers, config) {
                var author = data.data;
                $scope.author = author;
            })
            .error(function(data, status, headers, config) {
                //error gotten author info
                console.info(data);
            });

    }])

})(window);