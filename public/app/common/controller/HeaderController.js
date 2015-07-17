'use strict';

angular.module('app')

.controller('HeaderController', ['$scope', 'Projects', '$location', '$routeParams', 'SecurityService', 'AlertService',
    function($scope, Projects, $location, $routeParams, SecurityService, AlertService) {


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
            if ( !$scope.isNotificationVisible ) {
                AlertService.query({user_id : $scope.auth.profile.user_id}, function ( notifications ) {
                    $scope.notifications = notifications;
                });
            }
            $scope.isNotificationVisible = $scope.isNotificationVisible ? false : true;
        };
        
        $scope.viewUser = function ( /* String */alert ) {
            // summary
            //      redirect the user to the user profile page
            //      we would delete the invite alert once clicked
            // params
            //      alert - the alert object
            // tags
            //      private
            
            $scope.isNotificationVisible = false;
            $scope.deleteAlert( alert );
            $location.path("/user/" + alert.by_user.user_id).hash( $scope.returnUrl );
        }
        
        $scope.viewProject = function ( /* Object */alert ) {
            // summary
            //      redirect the user to the project details page
            //      we would delete the invite alert once clicked
            // params
            //      alert - the alert object
            // tags
            //      private
            
            $scope.isNotificationVisible = false;
            $scope.deleteAlert( alert );
            $location.path("/project/" + alert.project_id).hash( $scope.returnUrl );
        };
        
        $scope.deleteAlert = function ( /* Object */alert ) {
            // summary
            //      this function would delete the alert
            // params
            //      alert - the alert to be deleted
            
            AlertService.delete({id: alert._id}, function () {
                var index = $scope.notifications.indexOf(alert);
                $scope.notifications.splice(index, 1);
                console.log($scope.notifications.length);
            });
        };
        
        $scope.viewAlert = function( /* String */alert ) {
            // summary
            //      view the alert, determine which one to trigger by alert_type
            // params
            //      alert - the alert object
            // tags
            //      private
            
            if ( alert.alert_type === "accept" || alert.alert_type === "poke" ) {
                $scope.viewUser( alert );
            } else {
                $scope.viewProject( alert );
            }
        };
        
        AlertService.query({user_id : $scope.auth.profile.user_id}, function ( notifications ) {
            $scope.notifications = notifications;
        });

    }
]);