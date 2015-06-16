'use strict';

angular.module('project')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/app/home/home.html',
                    controller: 'HomeController'
                })


        }
    ]);