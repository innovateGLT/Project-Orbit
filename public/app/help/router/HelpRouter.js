'use strict';

angular.module('help')

    .config(['$routeProvider', '$locationProvider',
     
        function($routeProvider, $locationProvider) {
        
            $routeProvider
			
                .when('/help', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
            ;
    
            $locationProvider.html5Mode(true);
        }
    ]);