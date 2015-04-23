(function(){
    angular.module('slimWiki.directives', [])
        .directive('infoMessage', function(){
            return {
                restrict: 'E',
                templateUrl: '../partials/infoMessage.html'
            }
        })

        .directive('commentsForm', ['slimWikiService', function(slimWikiService){
            return {
                restrict: 'E',
                templateUrl: '../partials/comments.html',
                scope: {
                },
                link: function(scope, el, attrs){

                },
                controller: function ($scope) {
                    $scope.submitForm = function(isValid){
                        if(isValid){
                            var commentObject = {
                                name: $scope.user.name,
                                email: $scope.user.email,
                                comment: $scope.user.comment,
                            };

                            slimWikiService.saveComment(commentObject)
                                .then(function(promise){
                                    console.info('Promise: returned');
                                    console.info(promise);
                                }, function(err){
                                    console.info('Promise : Error returned');
                                    console.info(err);
                                })
                        }
                    };

                    $scope.deleteMessage = function(){

                    }
                }
            }
        }])

        .directive('inputFile', function () {
            return {
                restrict: 'E',
                templateUrl: '../partials/inputFile.html',
                scope: {
                    file: '=',
                    image: '='
                },
                link: function (scope, els, attrs) {
                    //attrs => from <input-file> , els => from inputFile.html, scope => isolate scope
                    var els = els.children();
                    var inputFile = angular.element(els[0]);

                    var reader = new FileReader();
                    reader.onload = function(e){
                        scope.image = e.target.result;
                        scope.$apply();
                    }

                    inputFile.bind('change', function (event) {
                        var file = event.target.files[0];
                        scope.file = file ? file : undefined;

                        reader.readAsDataURL(file);
                        scope.$apply();
                    });
                }
            };
        });
})();