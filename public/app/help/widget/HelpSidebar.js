'use strict';

angular.module("help")

	.directive("helpSidebar", ['$location', 
        function ($location) {
		
    		return {
                restrict: "EA",
    			templateUrl: "/app/help/widget/template/help-sidebar.html"
    		};
    	}
    ]);