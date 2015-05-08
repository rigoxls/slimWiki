(function(w){
    'use-strict';

    w.slimWiki.controllers.controller('upsertArticleController', ['$scope', '$http', '$routeParams', 'messageFactory','CKEditorConfig', function($scope, $http, $routeParams, messageFactory, CKEditorConfig){

        //if object doesn't exist, create it first time
        $scope.article = $scope.article || {};

        var key = $routeParams.permalink || null;

        $scope.pageTitle = (key) ? "Update Article" : "Create Article";;

        //set panel
        $scope.panel = "";

        //if key search article
        if(key){

            var findArticle = {
                action: 'findArticle',
                permalink: key
            };

            $http.post("/dashboard/post/", findArticle)
                .success(function(data, status, headers, config){

                    var article = data.data;

                    $scope.article.title = article.title;
                    $scope.article.description = article.description;
                    $scope.article.content = article.content;
                    $scope.article.tags = article.tags;
                    $scope.article.createdAt = article.created_at;
                    $scope.article.radioVisibility = article.visible == true ? 1 : 0;
                    $scope.article.id = article._id;

                })
                .error(function(data, status, headers, config){
                    //redirect to page 404
                    console.info('article not found');
                });
        }else{
            //init visibility
            $scope.article.radioVisibility = 0;
        }

        // function to submit the form after all validation has occurred
        $scope.submitForm = function(isValid) {

            //we need a simple validation to avoid showing invalid messages after save
            $scope.article.validate = true;

            // check to make sure the form is completely valid
            if (isValid) {

                //create a unique permalink
                var permalink = $scope.article.title.replace(/\s/g, '_');
                permalink = permalink.replace(/(\.|\/)/g, '_');
                permalink = permalink.replace(/\W/g, '') + '_' + Math.floor(Math.random() * 100);

                //tags
                var tags = [];
                if($scope.article.tags.length){
                     tags = $scope.article.tags.map(function(obj){
                        return obj.text;
                    });
                }

                var articleContent = {
                    action:       'createArticle',
                    title :       $scope.article.title,
                    description : $scope.article.description,
                    content :     $scope.article.content,
                    visible :     $scope.article.radioVisibility,
                    permalink:    permalink,
                    tags:         tags
                }

                //if key update article
                if(key){
                    articleContent.action = "updateArticle";
                    articleContent.id = $scope.article.id;
                }

                $http.post("/dashboard/post/", articleContent)
                    .success(function(data, status, headers, config) {
                       messageFactory.showMessage(data.textResponse, 1);
                       if(!key){
                           $scope.cleanForm();
                       }
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
            $scope.article.tags = [];
        };

        $scope.editorOptions = CKEditorConfig.configureCKEditor();

    }])

})(window);
