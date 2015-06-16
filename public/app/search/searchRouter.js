'use strict';

angular.module('project')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/app/search/list.html',
                    controller: 'SearchController'
                })


            ;
        }
    ]);