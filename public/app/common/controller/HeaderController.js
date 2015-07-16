'use strict';

angular.module('app')

.controller('HeaderController', ['$scope', 'Projects', '$location', '$routeParams', 'SecurityService',
    function($scope, Projects, $location, $routeParams, SecurityService) {


        console.log("MMMEEEEE");

        $scope.auth = SecurityService.auth();


        console.log('HEADER', $scope.auth, $scope.auth.isAuthenticated);

        $scope.isAdmin = false;

        $scope.$watch('auth.profile', function() {
            if (($scope.auth.profile) && ($scope.auth.profile.email === ADMIN_EMAIL)) {
                $scope.isAdmin = true;
            }
        });

        $scope.login = SecurityService.login;
        $scope.logout = SecurityService.logout;

        $scope.search = function() {
            $location.path('/search').search({q: $scope.query});
        };
        
        $scope.returnUrl = $location.path();
        
        $scope.isNotificationVisible = false;
        $scope.toggleNotifications = function () {
            // summary
            //      this function would retrieve all notifications of the user, triggered by the bell button from the navbar
            // tags
            //      private
            $scope.isNotificationVisible = $scope.isNotificationVisible ? false : true;
        };
        
        $scope.viewUser = function ( /* String */userId ) {
            // summary
            //      redirect the user to the user profile page
            // params
            //      userId - the user id of the profile to view
            // tags
            //      private
            
            $scope.isNotificationVisible = false;
            $location.path("/user/" + userId).hash( $scope.returnUrl );
        }

    }
]);