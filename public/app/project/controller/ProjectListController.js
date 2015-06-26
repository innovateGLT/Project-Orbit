'use strict';

angular.module('project')
    .controller('ProjectListController', ['$scope', 'Projects', '$location', '$routeParams', 'Credentials',
        function($scope, Projects, $location, $routeParams, Credentials) {

            $scope.auth = Credentials.auth();
            if ($scope.auth.profile.email === ADMIN_EMAIL) {
                $scope.isAdmin = true;
                $scope.projects = Projects.query();
            } else {
                $scope.isAdmin = false;
                $scope.projects = Projects.query({
                    country: $scope.auth.profile.country
                });
            }





        }
    ]);