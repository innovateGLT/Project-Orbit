'use strict';
angular.module('project')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/app/project/project.html',
                    controller: 'ProjectController'
                })

            .when('/category/:category', {
                templateUrl: '/app/project/project_cat.html',
                controller: 'ProjectCategoryController'
            })

            .when('/list', {
                templateUrl: '/app/project/project_list.html',
                controller: 'ProjectListController'
            })

            .when('/edit/:id', {
                templateUrl: '/app/project/project.html',
                controller: 'ProjectController'
            })

            .when('/:id', {
                templateUrl: '/app/project/projectDetail.html',
                controller: 'ProjectDetailCtrl'
            });
        }
    ]);