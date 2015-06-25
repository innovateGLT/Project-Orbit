'use strict';

angular.module('home')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/app/home/home.html',
                    controller: 'HomeController'
                });


        }
    ]);