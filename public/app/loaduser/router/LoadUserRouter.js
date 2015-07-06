'use strict';

angular.module('loaduser')
    .config(['$routeProvider', '$locationProvider',
		
        function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/loaduser', {
                    templateUrl: '/app/loaduser/template/load-user.html',
                    controller: 'LoadUserController'
                });

			$locationProvider.html5Mode(true);
        }
    ]);