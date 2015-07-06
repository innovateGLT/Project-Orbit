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
                }
    		};
        		
    	}
    ]);