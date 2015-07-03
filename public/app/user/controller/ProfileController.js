'use strict';

angular.module('user')
    .controller('ProfileController', ['$scope', 'Users', '$location', '$routeParams', 'Credentials', 'Projects', 'Bubble',
        function($scope, Users, $location, $routeParams, Credentials, Projects, Bubble) {


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

                $scope.user = user;
            })

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
                $location.path("/edit");
            }
            
            var getSkills = function() {
            	$scope.skillList = [];
                Users.getSkills({empId : $scope.auth.profile.empId}, function(data) {
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