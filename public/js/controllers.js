(function(){
    angular.module('slimWiki.controllers',[])
        .controller('newArticleController', ['$scope', '$http', 'messageFactory', function($scope, $http, messageFactory){

            //init visibility
            $scope.radioVisibility = '0';

            // function to submit the form after all validation has occurred
            $scope.submitForm = function(isValid) {

                //if object doesn't exist, create it first time
                $scope.article = $scope.article || {};

                //we need a simple validation to avoid showing invalid messages after save
                $scope.article.validate = true;

                // check to make sure the form is completely valid
                if (isValid) {

                    //create a unique permalink
                    var permalink = $scope.article.title.replace(/\s/g, '_');
                    permalink = permalink.replace(/(\.|\/)/g, '_');
                    permalink = permalink.replace(/\W/g, '') + '#' + Math.floor(Math.random() * 100);

                    var articleContent = {
                        title : $scope.article.title,
                        description : $scope.article.description,
                        content : $scope.article.content,
                        visible : $scope.radioVisibility,
                        permalink: permalink
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
            };

            $scope.editorOptions = {
                extraPlugins: 'codesnippet',
                toolbar: [
                    [ 'Source' ], [ 'Undo', 'Redo' ], [ 'Bold', 'Italic', 'Underline' ], [ 'CodeSnippet' ]
                ],
                codeSnippet_theme: 'monokai_sublime'
            };

        }])
})();

