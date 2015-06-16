'use strict';

angular.module('project')
    .controller('UserController', ['$scope', 'Users', '$location', '$routeParams', 'Credentials', 'Projects', 'SweetAlert',
        function($scope, Users, $location, $routeParams, Credentials, Projects, SweetAlert) {



            $scope.auth = Credentials.auth()
            $scope.isAdmin = false;

            $scope.$watch('auth.profile', function() {
                if (($scope.auth.profile) && ($scope.auth.profile.email == ADMIN_EMAIL)) {
                    $scope.isAdmin = true;
                }
            })

            var user = Users.getByUserId({
                user_id: $routeParams.id
            }, function() {

                // set default value
                if (user.skills.length == 0) {
                    user.skills = ["NONE"];
                }
                if (user.interests.length == 0) {
                    user.interests = ["NONE"];
                }


                $scope.user = user;




            })


            var projects = Projects.getByUserId({
                user_id: $routeParams.id
            }, function() {
                // console.log("USER PROJECT",projects);

                $scope.projects = projects;
            });


            var completedProjects = Projects.getCompletedProjectsByUserId({
                user_id: $routeParams.id
            }, function() {
                // console.log("USER PROJECT",projects);

                $scope.completedProjects = completedProjects;
            });


            $scope.feature = function() {
                $scope.user.featured = !$scope.user.featured;

                Users.update({
                    id: $scope.user._id
                }, $scope.user, function() {
                    if ($scope.user.featured == true) {
                        SweetAlert.swal("Featured User!", "The user has been marked to be featured!", "success");
                    } else {
                        SweetAlert.swal("Regular User!", "The featured user has been unmarked!", "success");
                    }
                });
            }
        }
    ])

;