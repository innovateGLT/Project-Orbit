'use strict';

angular.module('app')

.controller('HeaderController', ['$scope', 'Projects', '$location', '$routeParams', 'Credentials',
    function($scope, Projects, $location, $routeParams, Credentials) {


        console.log("MMMEEEEE");

        $scope.auth = Credentials.auth();


        console.log('HEADER', $scope.auth, $scope.auth.isAuthenticated);

        $scope.isAdmin = false;

        $scope.$watch('auth.profile', function() {
            if (($scope.auth.profile) && ($scope.auth.profile.email === ADMIN_EMAIL)) {
                $scope.isAdmin = true;
            }
        });

        $scope.login = Credentials.login;
        $scope.logout = Credentials.logout;

        $scope.search = function() {
            window.location = '/search/#/?q=' + $scope.query;
        };

    }
]);