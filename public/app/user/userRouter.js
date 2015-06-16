'use strict';

angular.module('project')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider

            .when('/list', {
                templateUrl: '/app/user/list.html',
                controller: 'UserListController'
            })
                .when('/:id', {
                    templateUrl: '/app/user/user.html',
                    controller: 'UserController'
                })



        }
    ]);