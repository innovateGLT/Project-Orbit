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
					
					$scope.viewUserDetails = function ( /* Object */user ) {
                        // summary
                        //      view project details page
                        // params
                        //      the project to view
                        // tags
                        //      private
                        
                        $location.path("/user/" + user.user_id).hash( $scope.returnUrl );
                    };
				}
			};
		
		}
	]);