'use strict';

angular.module("project")

	.directive("projectList", function () {
		
		return {
			restrict: "EAC",
			transclude: true,
			scope: {
				projects: "=projects"
			},
			templateUrl: "/app/project/widget/template/ProjectList.html"
		};
		
	});