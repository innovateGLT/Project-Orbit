'use strict';

angular.module('project')
   
    .config(['$routeProvider', '$locationProvider',
    
        function($routeProvider, $locationProvider) {
      
            $routeProvider
            
                .when('/search', {
                    templateUrl: '/app/project/template/searchResult.html',
                    controller: 'SearchController'
                })
                
                .when('/project', {
                    templateUrl: '/app/project/template/project.html',
                    controller: 'ProjectController'
                })
                
                .when('/project/list', {
                    templateUrl: '/app/project/template/projects.html',
                    controller: 'ProjectListController'
                })
    
                .when('/project/list/:category', {
                    templateUrl: '/app/project/template/projects.html',
                    controller: 'ProjectListController'
                })
    
                .when('/project/edit/:id', {
                    templateUrl: '/app/project/template/project.html',
                    controller: 'ProjectController'
                })
    
                .when('/project/:id', {
                    templateUrl: '/app/project/template/projectDetail.html',
                    controller: 'ProjectDetailController'
                });
                
            $locationProvider.html5Mode(true);
        }
    ]);