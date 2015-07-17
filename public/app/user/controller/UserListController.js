'use strict';

angular.module('user')
    .controller('UserListController', ['$scope', 'UserService', 'auth', 'Projects',
        function($scope, UserService, auth, Projects) {

            $scope.busy = false;
            
            $scope.loadNext = function () {
                // summary
                //      this function would load the list of users utilizing infinite scroll mechanism
                //      we would request 9 user records every call
                
                if ( !$scope.listFetchDisabled && !$scope.busy ) {
                
                    // set busy to true to prevent multiple ajax calls to the server
                    $scope.busy = true;
                    
                    UserService.query({
                        pageNo: $scope.pageNo,
                        recordsPerPage: $scope.recordsPerPage,
                        keyword: $scope.filter
                    }, function ( users ) {
    
                        users.forEach( function ( user ) {
                           
                            // populate users list
                            if ( $scope.users.indexOf( user ) === -1 && user.job_role.indexOf("CONTINGENT") === -1 ) {
                                $scope.users.push( user );
                            } else {
                                console.log("Duplicate user.");
                            }
                        });
                        
                        // if the last record has been hit, we disabled inifit scroll
                        if ( users.length < $scope.recordsPerPage ) {
                            $scope.listFetchDisabled = true;
                        }
                        
                        // pageNo increment
                        $scope.pageNo++;
    
                        // set busy to false to allow next calls
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
                $scope.users = [];
                
                $scope.listFetchDisabled = false;
            };

            $scope.reset();
            $scope.loadNext();
        }
    ])
;