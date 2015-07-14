'use strict';

angular.module('project')
    .controller('ProjectListController', ['$scope', 'Projects', '$location', '$routeParams', 'SecurityService',
        function($scope, Projects, $location, $routeParams, SecurityService) {

            // initial page to load
            $scope.pageNo         = 1;
            $scope.recordsPerPage = 8;
            
            // initialize projects list
            $scope.projects = [];

            $scope.category = $routeParams.category;

            $scope.auth = SecurityService.auth();
            $scope.isAdmin = $scope.auth.profile.email === ADMIN_EMAIL;
            
            $scope.busy = false;

            $scope.listFetchDisabled = false;
            $scope.loadNext = function () {
                // summary
                //      this function would load the list of projects
                //      for admins, we load project no matter what the country is
                //      for regular users, we only load the projects where the user is located, unless the project is marked Global
                
                if ( !$scope.listFetchDisabled ) {
                    
                    var args = {};
                    if ( !$scope.isAdmin ) {
                        // regular user
                        args = {
                            country: $scope.auth.profile.country,
                            category : $routeParams.category || "",
                            pageNo : $scope.pageNo,
                            recordsPerPage: $scope.recordsPerPage
                        };
                        
                    } else {
                        // admin user
                        args = {
                            category : $routeParams.category || "",
                            pageNo : $scope.pageNo,
                            recordsPerPage: $scope.recordsPerPage
                        };
                    }
                    
                    // set busy to true to disable next calls to avoid multiple async calls
                    $scope.busy = true;
                    
                    Projects.query({
                            country: $scope.auth.profile.country,
                            category : $routeParams.category || "",
                            pageNo : $scope.pageNo,
                            recordsPerPage: $scope.recordsPerPage
                        }, function ( projects ) {
                        
                        projects.forEach(function ( project ) {
                            $scope.projects.push( project );
                        });
                        
                        // if the end is already reached, we disable the auto scroll mechanism
                        if ( projects.length < $scope.recordsPerPage ) {
                            $scope.listFetchDisabled = true;
                        }
                        
                        // increment pageNo to load next page
                        $scope.pageNo++;
                        
                        // set busy to falls to allow next page calls
                        $scope.busy = false;
                    });
                }
            };
            
            // retrieve initial projects list
            $scope.loadNext();
        }
    ]);