'use strict';

angular.module("project")

	.directive("projectBadge", ['$location', 
        function ($location) {
		
    		return {
    			restrict: "EAC",
    			scope: {
    				project: "=project"
    			},
    			templateUrl: "/app/project/widget/template/ProjectBadge.html",
                controller: function ($scope) {
                    // implement just in case needed
                    
                    $scope.returnUrl = $location.path();
                    $scope.searchParams = $location.search();
                    
                    $scope.viewProjectDetails = function ( /* Object */project ) {
                        // summary
                        //      view project details page
                        // params
                        //      the project to view
                        // tags
                        //      private
                        
                        $location.path("/project/" + project._id).hash( $scope.returnUrl );
                    };
                }
    		};
        		
    	}
    ]);