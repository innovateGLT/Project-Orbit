'use strict';

angular.module('home')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/app/home/template/home.html',
                    controller: 'HomeController'
                });


        }
    ]);