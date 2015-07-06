'use strict';

angular.module("user")

	.directive("userBadge", ['$location',
		function ($location) {
		
			return {
				restrict: "EAC",
				scope: {
					user: "=user"
				},
				templateUrl: "/app/user/widget/template/UserBadge.html",
				controller: function ($scope) {
					
					$scope.returnUrl = $location.path();
				}
			};
		
		}
	]);