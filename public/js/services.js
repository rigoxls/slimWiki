(function(){
    angular.module('slimWiki.services', [])
        .factory('messageFactory', ['$timeout', '$rootScope', function($timeout, $rootScope){
            var factory = {};
            $rootScope.alertMessage = null;
            $rootScope.alertShow = false;

            factory.showMessage = function(msg, type){

                var type = parseInt(type, 10);
                var typeMessage = 'alert-info';

                if(type === 1){
                    typeMessage = 'alert-success';
                }else if(type === 2){
                    typeMessage = 'alert-danger';
                }

                $rootScope.alertMessage = msg;
                $rootScope.alertShow = true;
                $rootScope.alertType = typeMessage;

                $timeout(function(){
                    factory.hideMessage();
                },5000)
            };

            factory.hideMessage = function(){
                $rootScope.alertShow = false;
            };

            return factory;
        }])

        .factory('CKEditorConfig',[function(){

            var factory = {};

            factory.configureCKEditor = function(){
                return {
                    extraPlugins: 'codesnippet',
                    toolbar: [
                        [ 'Source' ], [ 'Undo', 'Redo' ], [ 'Bold', 'Italic', 'Underline', 'Image' ], [ 'CodeSnippet' ]
                    ],
                    codeSnippet_theme: 'monokai_sublime'
                };
            };

            return factory;
        }])

})();