(function(){
    angular.module('slimWiki.directives', [])
        .directive('infoMessage', function(){
            return {
                restrict: 'E',
                templateUrl: '../partials/infoMessage.html'
            }
        })
})();