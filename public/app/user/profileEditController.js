'use strict';

angular.module('project')
    .controller('ProfileEditController', ['$scope', 'Users', '$location', '$routeParams', 'auth', 'Credentials', 'Projects', 'SweetAlert',
        function($scope, Users, $location, $routeParams, auth, Credentials, Projects, SweetAlert) {

            $scope.auth = Credentials.auth();

            if (!$scope.auth.isAuthenticated) {
                Credentials.login();
                return;
            }

            $scope.userId = $scope.auth.profile.user_id;


            var user = Users.getByUserId({
                user_id: $scope.userId
            }, function() {

                // set default value
                if (!user.skills) {
                    user.skills = [];
                }
                if (!user.interests) {
                    user.interests = [];
                }

                $scope.skills = user.skills.join(',');
                $scope.interests = user.interests.join(',');
                $scope.user = user;
                $scope.status = user.status;

                console.log("USER", user);
            })


            $scope.save = function() {

                // trim
                var skills = $scope.skills.split(",");
                for (var i = 0; i < skills.length; i++) {
                    skills[i] = skills[i].trim();
                };
                user.skills = skills;


                // trim interests
                var interests = $scope.interests.split(",");
                for (var i = 0; i < interests.length; i++) {
                    interests[i] = interests[i].trim();
                };
                user.interests = interests;

                user.status = $scope.status;
                $scope.status = !$scope.status;


                Users.update({
                    id: user._id
                }, user);
                console.log("USER HAS BEEN UPDATED", user);
                // alert("The user has been saved!");
                SweetAlert.swal("Saved!", "The user's profile has been updated.", "success");
            }


            $scope.goToProfile = function() {
                $location.path("/");
            }
        }
    ])

;