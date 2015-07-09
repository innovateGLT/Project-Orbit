'use strict';

angular.module('help')

    .config(['$routeProvider', '$locationProvider',
     
        function($routeProvider, $locationProvider) {
        
            $routeProvider
			
                .when('/help', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/how-it-started', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/how-it-works', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/how-it-works/seeker', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/how-it-works/owner', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/how-it-works/benefits', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/how-it-works/accessibility', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/your-profile', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/your-profile/basics', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/your-profile/manage', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/faq', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/faq/posting-an-opportunity', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/faq/managing-an-opportunity', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/faq/applying-an-opportunity', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/faq/rating-an-opportunity', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/faq/rating-a-user', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
                .when('/help/contact-us', {
                    templateUrl: '/app/help/template/help.html',
                    controller: 'HelpController'
                })
                
            ;
    
            $locationProvider.html5Mode(true);
        }
    ]);