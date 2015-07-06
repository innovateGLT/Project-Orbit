'use strict';

var app = angular.module('profile');

app.config(['$routeProvider', '$locationProvider',

    function($routeProvider, $locationProvider) {
        $routeProvider

            // my profile
            .when('/profile', {
                templateUrl: '/app/profile/template/profile.html',
                controller: 'ProfileController'
            })

            // edit my profile
            .when('/profile/edit', {
                templateUrl: '/app/profile/template/profile-edit.html',
                controller: 'ProfileEditController'
            });

        $locationProvider.html5Mode(true);
    }
]);