'use strict';

angular.module('profile')
    .controller('ProfileController', ['$scope', 'ProfileService', '$location', '$routeParams', 'SecurityService', 'Projects', 'Bubble',
        function($scope, ProfileService, $location, $routeParams, SecurityService, Projects, Bubble) {


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


            // variable to store how many project tabs would be shown
            $scope.projectTabs = 0;

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

            // Retrieve user's current projects
            Projects.getByUserId({
                user_id: $scope.userId
            }, function( projects ) {

                $scope.projects = projects;
                
                if ( $scope.projects && $scope.projects.length > 0 ) {
                    $scope.projectTabs++;
                }
            });

            // Retrieve user's completed projects
            Projects.getCompletedProjectsByUserId({
                user_id: $scope.userId
            }, function( completedProjects ) {

                $scope.completedProjects = completedProjects;
                
                if ( $scope.completedProjects && $scope.completedProjects.length > 0 ) {
                    $scope.projectTabs++;
                }
            });

            // Retrieve user's project invitations
            Projects.invited({
                id: $scope.userId
            }, function ( invitedProjects ) {
                
                $scope.invitedProjects = invitedProjects;
                
                if ( $scope.invitedProjects && $scope.invitedProjects.length > 0 ) {
                    $scope.projectTabs++;
                }
            });

            /* Matched projects based on skills and interests */
            Projects.getMatchedProjectsByUserId({
                user_id: $scope.userId
            }, function( matchedProjects ) {

                $scope.matchedProjects = matchedProjects;
                
                if ( $scope.matchedProjects && $scope.matchedProjects.length > 0 ) {
                    $scope.projectTabs++;
                }
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
            
            $scope.skillsActive = true;
            $scope.interestsActive = false;
            $scope.showSkillsTab = function () {
                $scope.skillsActive = true;
                $scope.interestsActive = false;
            };
            
            $scope.showInterestsTab = function () {
                $scope.skillsActive = false;
                $scope.interestsActive = true;
                
            };
            
            $scope.showProjectsTab = function ( /* String */tabName ) {
                // summary
                //      Show the requested project tab
                // param
                //      tabName - the name of the tab to be shown
                
                $scope.projectTabContainers = [];
                $scope.projectTabContainers[ tabName ] = true;
            };
            
            // set default projects tab to Current Projects
            $scope.showProjectsTab('current');
        }
    ])

;