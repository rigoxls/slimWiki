(function(){
    angular.module('slimWiki.controllers',[])
        .controller('newArticleController', ['$scope', '$http', function($scope, $http){

            // function to submit the form after all validation has occurred
            $scope.submitForm = function(isValid) {

                // check to make sure the form is completely valid
                if (isValid) {
                    var articleContent = {
                        title : $scope.article.title,
                        description : $scope.article.description,
                        content : $scope.article.content
                    }

                    $http.post("http://localhost:5000/dashboard/post/", articleContent)
                        .success(function(data, status, headers, config) {
                           console.info("good");
                           console.info(data);
                        }).
                        error(function(data, status, headers, config) {
                            console.info("bad");
                            console.info(data);
                    });
                }
            };

        }])
})();

