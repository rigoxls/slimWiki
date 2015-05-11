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
                    articleId: '@articleId',
                    permalink: '@permalink',
                    currentUser: '@currentuser'
                },
                link: function(scope, el, attrs){},
                controller: function ($scope, $window) {

                    $scope.isAuthor = function(currentUserId, authorId){
                        if(currentUserId == authorId){
                            return true;
                        }
                        return false;
                    };

                    $scope.getComments = function(){
                        if(!$scope.permalink){
                            $scope.permalink = $window.location.hash.replace(/#\/showArticle\//g,'');
                        }

                        slimWikiService.getComments($scope.permalink)
                            .then(function(promise){
                                if(promise.data.comments){
                                    $scope.comments = promise.data.comments;
                                    $scope.articleId = promise.data._id;
                                    $scope.authorId = promise.data.user_id._id;
                                    promise.data.comments.sort(function(a, b){
                                        if(a.date > b.date){
                                            return -1;
                                        }else{
                                            return 1
                                        }
                                    });
                                }
                            }, function(err){
                                console.info(err);
                            });
                    };

                    $scope.submitForm = function(isValid){

                        if(isValid){
                            var commentObject = {
                                articleId: $scope.articleId,
                                name: $scope.user.name,
                                email: $scope.user.email,
                                comment: $scope.user.comment,
                            };

                            slimWikiService.saveComment(commentObject)
                                .then(function(promise){
                                    $scope.getComments();
                                    $scope.user.name = $scope.user.email = $scope.user.comment = '';
                                }, function(err){
                                    console.info('Promise : Error returned');
                                    console.info(err);
                                })
                        }
                    };

                    $scope.removeComment = function(articleId, commentId){
                        slimWikiService.removeComment(articleId, commentId)
                            .then(function(promise){
                                $scope.getComments();
                            },function(err){
                                console.info('Promise : Error returned');
                                console.info(err);
                            })
                    };

                    $scope.getComments();
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
        })

        .directive('searchForm', function(){
            return {
                restrict: 'E',
                templateUrl: '../partials/search.html',
                controller: function($scope, $window){

                    $scope.submitForm = function(isValid){
                        if(isValid){
                            $window.location.href = '/#/home/' + $scope.keyText;
                        }
                    };

                }
            }
        })
})();