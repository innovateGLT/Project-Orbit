'use strict';

angular.module("project")

	.directive("projectBadge", function () {
		
		return {
			restrict: "EAC",
			scope: {
				project: "=project"
			},
			templateUrl: "/app/project/widget/template/ProjectBadge.html"
		};
		
	});