'use strict';

angular.module('project')
    .controller('ProjectListController', ['$scope', 'Projects', '$location', '$routeParams', 'SecurityService',
        function($scope, Projects, $location, $routeParams, SecurityService) {

            $scope.category = $routeParams.category;

            $scope.auth = SecurityService.auth();
            if ($scope.auth.profile.email === ADMIN_EMAIL) {
                $scope.isAdmin = true;
                $scope.projects = Projects.query({
                    category : $routeParams.category || ""
                });
            } else {
                $scope.isAdmin = false;
                $scope.projects = Projects.query({
                    country: $scope.auth.profile.country,
                    category : $routeParams.category || ""
                });
            }

        }
    ]);