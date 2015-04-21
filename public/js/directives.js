(function(){
    angular.module('slimWiki.directives', [])
        .directive('infoMessage', function(){
            return {
                restrict: 'E',
                templateUrl: '../partials/infoMessage.html'
            }
        })

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