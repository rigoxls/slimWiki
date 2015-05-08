(function(w){
    'use-strict';

    w.slimWiki.controllers.controller('deleteArticleModal', ['$scope', '$modalInstance', '$http', 'messageFactory', 'params', function($scope, $modalInstance, $http, messageFactory, params){
        $scope.params = params;

        $scope.ok = function (article) {
          $modalInstance.close();

            var articleContent = {
                id: article._id,
                action: 'updateArticle',
                deleted: true
            };

            $http.post("/dashboard/post/", articleContent)
                .success(function(data, status, headers, config) {
                    angular.element( document.querySelector('#a_' + article._id)).remove();
                }).
                error(function(data, status, headers, config) {
                    messageFactory.showMessage(data.textResponse, 2);
                });

        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };

    }])

})(window);