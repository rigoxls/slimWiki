(function(){
    angular.module('slimWiki.controllers',[])
        .controller('newArticleController', ['$scope', '$http', 'messageFactory', function($scope, $http, messageFactory){

            // function to submit the form after all validation has occurred
            $scope.submitForm = function(isValid) {


                $scope.tinymceOptions = {
                    handle_event_callback: function (e) {
                    // put logic here for keypress
                    }
                };


                //if object doesn't exist, create it first time
                $scope.article = $scope.article || {};

                //we need a simple validation to avoid show invalid messages after save
                $scope.article.validate = true;

                // check to make sure the form is completely valid
                if (isValid) {

                    var articleContent = {
                        title : $scope.article.title,
                        description : $scope.article.description,
                        content : $scope.article.content
                    }

                    $http.post("http://localhost:5000/dashboard/post/", articleContent)
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
            };

        }])
})();

