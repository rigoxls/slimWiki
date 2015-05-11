(function(w){
    'use-strict';

    w.slimWiki.controllers.controller('navBarController',['$rootScope','$scope', '$http', function($rootScope, $scope, $http){

        $scope.toggleState = (window.innerWidth > 452) ? true : false;

        $scope.toggle = function(){
            $scope.toggleState = !$scope.toggleState;
        }

    }])

})(window);