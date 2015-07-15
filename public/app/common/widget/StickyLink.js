'use strict';

angular.module("app")

	.directive("stickyLink", ['$window', '$document', function ( $window, $document ) {
		
		return {
			
			restrict: "A",
			link: function (scope, elem, attrs) {
				
				angular.element($window).bind("scroll", function () {
					
					if ( $window.pageYOffset >= 300 ) {
						elem.removeClass("ng-hide");
					} else {
						elem.addClass("ng-hide");
					}
					
					var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
				    var body = document.body, html = document.documentElement;
				    var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
				    var windowBottom = windowHeight + window.pageYOffset;
				    if (windowBottom >= docHeight) {
				        elem.addClass("bottom");
				    } else {
						elem.removeClass("bottom")
					} 
					
				});
				
				scope.backToTop = function () {
					// scroll back to top on page change
		            $document.scrollTopAnimated(0, 500).then(function() {
		                console && console.log('You just scrolled to the top!');
						angular.element(document.querySelector('#filterList')).focus();
		            });
				};
			}
			
		};
		
	}]);