'use strict';

angular.module('profile')
    .controller('ProfileController', ['$scope', 'ProfileService', '$location', '$routeParams', 'SecurityService', 'Projects', 'Bubble', 'Analytics',
        function($scope, ProfileService, $location, $routeParams, SecurityService, Projects, Bubble, Analytics) {


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

                /*$scope.filteredMatchedProjects = [];
                
                $scope.removeCurrentProjects();
                $scope.removeCompletedProjects();
                $scope.removeInvitations();*/
                
                if ( $scope.matchedProjects && $scope.matchedProjects.length > 0 ) {
                    $scope.projectTabs++;
                }
            });
            
            $scope.removeCurrentProjects = function () {
                // summary
                //      this function would remove current projects from the list of matched projects
                // tags
                //      private
                
                $scope.projects.forEach( function ( project ) {
                    
                    $scope.matchedProjects.forEach(function ( matchedProject ) {

                        if ( matchedProject._id !== project._id && $scope.filteredMatchedProjects.indexOf( project ) == -1 ) {

                            // if the two project id's doesn't matched, we add it
                            $scope.filteredMatchedProjects.push( project );
                        }

                    });

                });
            };
            
            $scope.removeCompletedProjects = function () {
                // summary
                //      this function would remove completed projects from the list of matched projects
                // tags
                //      private
                
                $scope.completedProjects.forEach( function ( completedProject ) {
                    
                    $scope.matchedProjects.forEach(function ( matchedProject ) {

                        if ( completedProject._id !== matchedProject._id && $scope.filteredMatchedProjects.indexOf( completedProject ) == -1 ) {

                            // if the two project id's doesn't matched, we add it
                            $scope.filteredMatchedProjects.push( completedProject );
                        }

                    });

                });
            };
            
            $scope.removeInvitations = function () {
                // summary
                //      this function would remove project invitations from the list of matched projects
                // tags
                //      private
                
                $scope.invitedProjects.forEach( function ( invitation ) {
                    
                    $scope.matchedProjects.forEach(function ( matchedProject ) {

                        if ( invitation._id !== matchedProject._id && $scope.filteredMatchedProjects.indexOf( invitation ) == -1 ) {

                            // if the two project id's doesn't matched, we add it
                            $scope.filteredMatchedProjects.push( invitation );
                        }

                    });

                });
            };

            $scope.editProfile = function() {
                $location.path("/profile/edit");
            };
            
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
                		Bubble.generateClickableBubble($scope.skillList);
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
            
            $scope.search = function ( /* String */searchQuery ) {
                // summary
                //      this function is triggered when the user clicks on a skill or interest pill
                //      the user would then be redirected to the search results
                // params
                //      searchQuery - the clicked skill or interest
                
                $location.path("/search").search({q: searchQuery});
            };
            
            // set default projects tab to Current Projects
            $scope.showProjectsTab('current');
             //Analytics visitors
             Analytics.visitor({
                user_id: $scope.auth.profile._id,
                role: $scope.auth.profile.role,
                job_role: $scope.auth.profile.job_role,
                country: $scope.auth.profile.country
            }, function(ret) {
                console.log('visitor', ret);
            });

        }
    ])

;