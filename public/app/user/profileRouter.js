'use strict';

angular.module('project')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/app/user/profile.html',
                    controller: 'ProfileController'
                })

            .when('/edit', {
                templateUrl: '/app/user/profileEdit.html',
                controller: 'ProfileEditController'
            })


        }
    ]);