'use strict';

angular.module('user')
    .controller('UserController', ['$scope', 'UserService', '$location', '$routeParams', 'SecurityService', 'Projects', 'SweetAlert', 'Bubble', 'store',
        function($scope, UserService, $location, $routeParams, SecurityService, Projects, SweetAlert, Bubble, store) {



            $scope.auth = SecurityService.auth();
            $scope.isAdmin = false;

            $scope.$watch('auth.profile', function() {
                if (($scope.auth.profile) && ($scope.auth.profile.email == ADMIN_EMAIL)) {
                    $scope.isAdmin = true;
                }
            });

            // variable to store how many project tabs would be shown
            $scope.projectTabs = 0;

            var user = UserService.getByUserId({
                user_id: $routeParams.id
            }, function() {

                // set default value
                if (user.skills.length == 0) {
                    user.skills = [];
                }
                if (user.interests.length == 0) {
                    user.interests = [];
                }

                if ( user.email !== ADMIN_EMAIL ) {
                    $scope.userProfileView = true;
                }

                $scope.user = user;
                getSkills($scope.user.empId);
            });

            // Retrieve user's current projects
            Projects.getByUserId({
                user_id: $routeParams.id
            }, function( projects ) {

                $scope.projects = projects;
                
                if ( $scope.projects && $scope.projects.length > 0 ) {
                    $scope.projectTabs++;
                }
            });

            // Retrieve user's completed projects
            Projects.getCompletedProjectsByUserId({
                user_id: $routeParams.id
            }, function( completedProjects ) {

                $scope.completedProjects = completedProjects;
                
                if ( $scope.completedProjects && $scope.completedProjects.length > 0 ) {
                    $scope.projectTabs++;
                }
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
                // summary
                //      return back to projects list
                //      if a hash is existing in the url, we determine that the user came from the projects list filtered by category
                //      also attacht the previous search params if any
                
                var returnUrl = $location.hash();
                $location.hash("");
                
                $location.path(returnUrl).search(store.get("searchParams"));
                store.remove("searchParams");
            };
            
            
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
        }
    ])

;