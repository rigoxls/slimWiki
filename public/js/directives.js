(function(){
    angular.module('slimWiki.directives', [])
        .directive('infoMessage', function(){
            return {
                restrict: 'E',
                templateUrl: '../partials/infoMessage.html'
            }
        })

        .directive('file', function () {
            return {
                scope: {
                    file: '='
                },
                link: function (scope, el, attrs) {
                    el.bind('change', function (event) {
                        var file = event.target.files[0];
                        scope.file = file ? file : undefined;
                        scope.$apply();
                    });
                }
            };
        });
})();