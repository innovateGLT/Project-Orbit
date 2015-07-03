'use strict';

angular.module("user")

	.directive("userBadge", function () {
		
		return {
			restrict: "EAC",
			scope: {
				user: "=user"
			},
			templateUrl: "/app/user/widget/template/UserBadge.html"
		};
		
	});