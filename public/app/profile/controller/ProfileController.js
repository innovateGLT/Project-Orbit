'use strict';

angular.module('profile')
    .controller('ProfileController', ['$scope', 'ProfileService', '$location', '$routeParams', 'SecurityService', 'Projects', 'Bubble',
        function($scope, ProfileService, $location, $routeParams, SecurityService, Projects, Bubble) {


            $scope.auth = SecurityService.auth();

            if (!$scope.auth.isAuthenticated) {
                SecurityService.login();
                return;
            }

            $scope.profileViewMode = true;
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

                $scope.user = user;
            });

            var projects = Projects.getByUserId({
                user_id: $scope.userId
            }, function() {
                // console.log("USER PROJECT",projects);

                $scope.projects = projects;
            });

            var completedProjects = Projects.getCompletedProjectsByUserId({
                user_id: $scope.userId
            }, function() {

                $scope.completedProjects = completedProjects;
            });

            $scope.invitedProjects = Projects.invited({
                id: $scope.userId
            });

            /* Matched projects based on skills and interests */
            var matchedProjects = Projects.getMatchedProjectsByUserId({
                user_id: $scope.userId
            }, function() {

                $scope.matchedProjects = matchedProjects;
            });

            $scope.editProfile = function() {
                $location.path("/profile/edit");
            }
            
            var getSkills = function() {
            	$scope.skillList = [];
                ProfileService.getSkills({empId : $scope.auth.profile.empId}, function(data) {
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
            }();
        }
    ])

;