'use strict';

angular.module("project")

	.directive("stickyLink", function ( $window ) {
		
		return {
			
			restrict: "A",
			link: function (scope, elem, attrs) {
				
				angular.element($window).bind("scroll", function () {
					
					if ( $window.pageYOffset >= 300 ) {
						elem.addClass("sticky");
					} else {
						elem.removeClass("sticky");
					}
					
				});
				
			}
			
		};
		
	});