(function(w){
    'use-strict';

    w.slimWiki.controllers.controller('userProfileController',['$rootScope','$scope', '$http','messageFactory', function($rootScope, $scope, $http, messageFactory){

        $scope.user = $scope.user || {};

        $http.post("/dashboard/post/", {action:"findUser"})
            .success(function(data, status, headers, config) {
               var rUser = data.data;
               $scope.user.name = rUser.name;
               $scope.user.email = rUser.email !== 'undefined' ? rUser.email : '';
               $scope.user.city = rUser.city !== 'undefined' ? rUser.city : '';
               $scope.user.bio = rUser.bio !== 'undefined' ? rUser.bio : '';
            });


        $scope.submitForm = function(isValid) {
            //if form is valid
            if(isValid){

                var fileName = null;

                if($scope.file){
                    fileName = $scope.file.name.replace(/[^a-zA-Z0-9\.]+/g, '-').toLowerCase();
                }

                $http({
                    method: 'POST',
                    url: '/dashboard/post/',
                    headers: {
                        'Content-Type' : 'multipart/form-data'
                    },
                    data:{
                        action: 'updateProfile',
                        name: $scope.user.name,
                        email:$scope.user.email,
                        city: $scope.user.city,
                        bio:  $scope.user.bio,
                        file: $scope.file,
                        fileName: fileName
                    },
                    //emulate a post/ multipart data
                    transformRequest: function (data, headersGetter) {
                        var formData = new FormData();
                        angular.forEach(data, function (value, key) {
                            formData.append(key, value);
                        });

                        var headers = headersGetter();
                        delete headers['Content-Type'];

                        return formData;
                    }
                })
                .success(function(data){
                    var lUser = data.data;
                    $rootScope.user = $rootScope || {};
                    messageFactory.showMessage(data.textResponse, 1);
                    $rootScope.user.photo = lUser.photo;
                    $rootScope.user.name = lUser.name;
                })
                .error(function (data, status) {
                    messageFactory.showMessage('error updating profile', 2);
                })

            }
        }

    }])

})(window);