'use strict';

angular.module('user')
    .controller('UserController', ['$scope', 'UserService', '$location', '$routeParams', 'SecurityService', 'Projects', 'SweetAlert', 'Bubble',
        function($scope, UserService, $location, $routeParams, SecurityService, Projects, SweetAlert, Bubble) {



            $scope.auth = SecurityService.auth()
            $scope.isAdmin = false;

            $scope.$watch('auth.profile', function() {
                if (($scope.auth.profile) && ($scope.auth.profile.email == ADMIN_EMAIL)) {
                    $scope.isAdmin = true;
                }
            })

            var user = UserService.getByUserId({
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
                getSkills($scope.user.empId);
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

                UserService.update({
                    id: $scope.user._id
                }, $scope.user, function() {
                    if ($scope.user.featured == true) {
                        SweetAlert.swal("Featured User!", "The user has been marked to be featured!", "success");
                    } else {
                        SweetAlert.swal("Regular User!", "The featured user has been unmarked!", "success");
                    }
                });
            }
            
            var getSkills = function(empId) {
            	$scope.skillList = [];
                UserService.getSkills({empId : parseInt(empId)}, function(data) {
                	if(data.person) {
                        data.person.skills.forEach(function(s) {
                      	  $scope.skillList.push({
                          	'category' : s.category,
                              'skill' : s.skill,
                              'rating' : s.rating
                            }); 
                        });
                      }  
                      // Generate bubble chart using D3 API
                	if($scope.skillList.length > 0) {
                		Bubble.generateBubble($scope.skillList);
                	}
                });
            };
            
            $scope.returnUrl = $location.hash();
            
            $scope.backToList = function() {
                var returnUrl = $location.hash();
                $location.hash("");
                $location.path(returnUrl);
            };
            
            
        }
    ])

;