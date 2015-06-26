'use strict';

angular.module('project')
    .controller('ProjectCategoryController', ['$scope', 'Projects', '$location', '$routeParams', 'Credentials',
        function($scope, Projects, $location, $routeParams, Credentials) {




            // console.log($routeParams);

            $scope.auth = Credentials.auth();
            if ($scope.auth.profile.email === ADMIN_EMAIL) {
                $scope.isAdmin = true;
                $scope.projects = Projects.query({
                    category: $routeParams.category
                });
            } else {
                $scope.isAdmin = false;
                $scope.projects = Projects.query({
                    category: $routeParams.category,
                    country: $scope.auth.profile.country
                });
            }


            $scope.title = "Category: " + $routeParams.category;

        }
    ]);