'use strict';

angular.module('user')
    .controller('UserListController', ['$scope', 'UserService', 'auth', 'Projects',
        function($scope, UserService, auth, Projects) {

            // initial page to load
            $scope.pageNo         = 1;
            // no of records to retrieve every call
            $scope.recordsPerPage = 9;

            // initialize users array
            $scope.users = [];

            $scope.busy = false;
            
            $scope.loadNext = function () {
                // summary
                //      this function would load the list of users utilizing infinite scroll mechanism
                //      we would request 9 user records every call
                
                // set busy to true to prevent multiple ajax calls to the server
                $scope.busy = true;
                
                UserService.query({
                    pageNo: $scope.pageNo,
                    recordsPerPage: $scope.recordsPerPage
                }, function ( users ) {

                    users.forEach( function ( user ) {
                       
                        // populate users list
                        $scope.users.push( user );
                    });
                    
                    // if the last record has been hit, we disabled inifit scroll
                    if ( users.length < $scope.recordsPerPage ) {
                        $scope.disabled = true;
                    }
                    
                    // pageNo increment
                    $scope.pageNo++;

                    // set busy to false to allow next calls
                    $scope.busy = false;
                });
                
            };

            $scope.loadNext();
        }
    ])
;