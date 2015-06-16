'use strict';
angular.module('project')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/app/loaduser/loaduser.html',
                    controller: 'LoadUserController'
                })


        }
    ]);