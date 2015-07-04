'use strict';

angular.module('user')
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
                $scope.interests = user.interests;
                $scope.user = user;
                $scope.status = user.status;

                console.log("USER", user);
            });


            $scope.save = function() {

                user.interests = $scope.interests;

                user.status = $scope.status;
                $scope.status = !$scope.status;


                var deferred = Users.update({
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
                $location.path("/");
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