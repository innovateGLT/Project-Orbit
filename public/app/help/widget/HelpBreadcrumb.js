'use strict';

angular.module("help")

	.directive("helpBreadcrumb", ['$location', 
        function ($location) {
		
    		return {
                restrict: "EA",
    			templateUrl: "/app/help/widget/template/help-breadcrumb.html"
    		};
        		
    	}
    ]);