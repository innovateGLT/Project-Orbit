'use strict';

angular.module('profile')
    .controller('ProfileEditController', ['$scope', 'ProfileService', '$location', '$routeParams', 'auth', 'SecurityService', 'Projects', 'SweetAlert',
        function($scope, ProfileService, $location, $routeParams, auth, SecurityService, Projects, SweetAlert) {

            $scope.auth = SecurityService.auth();

            if (!$scope.auth.isAuthenticated) {
                SecurityService.login();
                return;
            }

            $scope.$watch('auth.profile', function() {
                if (($scope.auth.profile) && ($scope.auth.profile.email === ADMIN_EMAIL)) {
                    $scope.isAdmin = true;
                }
            });

            $scope.userId = $scope.auth.profile.user_id;


            var user = ProfileService.getByUserId({
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
                $scope.interests = user.interests;
                $scope.user = user;
                $scope.status = user.status;

                console.log("USER", user);
            });


            $scope.save = function() {

                user.interests = $scope.interests;

                user.status = $scope.status;
                $scope.status = !$scope.status;


                var deferred = ProfileService.update({
                    id: user._id
                }, user).$promise;
                
                deferred.then(function () {
                    
                    SweetAlert.swal({
                        title: "Saved!",
                        type: "success",
                        text: "The user's profile has been updated."
                    }, function(){ 
                        console.log("The user's profile has been updated.");
                        $scope.goToProfile();
                    });
                });
                
            };


            $scope.goToProfile = function() {
                $location.path("/profile");
            };
            
            $scope.addInterest = function() {
                if ( $scope.interest ) {
                    $scope.interests.push($scope.interest.trim());
                    $scope.interest = "";
                }
            };
              
            $scope.removeInterest = function(index) {
                $scope.interests.splice(index, 1);
            };
              
            $scope.clearAll = function() {
                $scope.interests = [];
            };
        }
    ])

;