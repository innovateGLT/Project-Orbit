'use strict';

angular.module('user')

    .config(['$routeProvider', '$locationProvider',
     
        function($routeProvider, $locationProvider) {
        
            $routeProvider
    
                // user listing
                .when('/user/list', {
                    templateUrl: '/app/user/template/users.html',
                    controller: 'UserListController'
                })
                
                // user profile
                .when('/user/:id', {
                    templateUrl: '/app/user/template/user.html',
                    controller: 'UserController'
                })
            ;
    
            $locationProvider.html5Mode(true);
        }
    ]);