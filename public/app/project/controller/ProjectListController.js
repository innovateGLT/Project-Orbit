'use strict';

angular.module('project')
    .controller('ProjectListController', ['$scope', 'Projects', '$location', '$routeParams', 'SecurityService',
        function($scope, Projects, $location, $routeParams, SecurityService) {

            $scope.category = $routeParams.category;

            $scope.auth = SecurityService.auth();
            $scope.isAdmin = $scope.auth.profile.email === ADMIN_EMAIL;
            
            $scope.busy = false;
            
            $scope.loadNext = function () {
                // summary
                //      this function would load the list of projects
                //      for admins, we load project no matter what the country is
                //      for regular users, we only load the projects where the user is located, unless the project is marked Global
                
                if ( !$scope.listFetchDisabled && !$scope.busy ) {
                    
                    var args = {};
                    if ( !$scope.isAdmin ) {
                        // regular user
                        args = {
                            country: $scope.auth.profile.country,
                            category : $routeParams.category || "",
                            pageNo : $scope.pageNo,
                            recordsPerPage: $scope.recordsPerPage,
                            keyword: $scope.filter
                        };
                        
                    } else {
                        // admin user
                        args = {
                            category : $routeParams.category || "",
                            pageNo : $scope.pageNo,
                            recordsPerPage: $scope.recordsPerPage,
                            keyword: $scope.filter
                        };
                    }
                    
                    // set busy to true to disable next calls to avoid multiple async calls
                    $scope.busy = true;
                    
                    Projects.query(args, function ( projects ) {
                        
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
            
            $scope.search = function () {
                // summary
                //      this function would just reset the load params before triggering the search
                // tags
                //      private
                
                $scope.reset();
                $scope.loadNext();
                
                $scope.searchKeyword = $scope.filter;
            };
            
            $scope.searchKeyword = "";
            
            $scope.doSearch = function ( /* Event */event ) {
                // summary
                //      if the user hits Enter key on the filter box, we would do a full search again using any keyword in the filter box
                //      if the user deletes all the keywords on the filter box, we would do a full search with empty keywords thus, retrieving paginated data again
                // params
                //      event - the key event
                // tags
                //      private
                
                // we don't wanna trigger the search again if the user is using the same search keyword
                if ( (event.keyCode === 13 || $scope.filter === "") && $scope.searchKeyword !== $scope.filter ) {
                    $scope.search();
                }
            };
            
            $scope.reset = function () {
                // initial page to load
                $scope.pageNo         = 1;
                $scope.recordsPerPage = 8;
                
                // initialize projects list
                $scope.projects = [];
                
                $scope.listFetchDisabled = false;
            };
            
            // retrieve initial projects list
            $scope.reset();
            $scope.loadNext();
        }
    ]);