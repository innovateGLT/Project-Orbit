'use strict';



angular.module('project')

.factory('Projects', ['$resource',
    function($resource) {

        return $resource('/api/projects/:id', null, {
            'update': {
                method: 'PUT'
            },
            'get': {
                method: 'GET'
            },
            'apply': {
                method: 'POST',
                'url': '/api/projects/apply'
            },
            'search': {
                method: 'GET',
                'url': '/api/projects/search',
                isArray: true
            },
            'invited': {
                method: 'GET',
                'url': '/api/projects/invited',
                isArray: true
            },
            'featured': {
                method: 'GET',
                'url': '/api/projects/featured',
                isArray: true
            },
            'getByUserId': {
                method: 'GET',
                'url': '/api/projects/by_user_id/:user_id',
                isArray: true
            },
            'getCompletedProjectsByUserId': {
                method: 'GET',
                'url': '/api/projects/completed/by_user_id/:user_id',
                isArray: true
            }
        });
    }
])
    .factory('Users', ['$resource',
        function($resource) {

            return $resource('/api/users/:id', null, {
                'update': {
                    method: 'PUT'
                },
                'login': {
                    method: 'POST',
                    'url': '/api/users/login',
                },
                'get': {
                    method: 'GET'
                },
                'getMatches': {
                    method: 'GET',
                    'url': '/api/users/matches',
                    isArray: true
                },
                'featured': {
                    method: 'GET',
                    'url': '/api/users/featured',
                    isArray: true
                },
                'upsert': {
                    method: 'PUT',
                    'url': '/api/users/upsert/:user_id'
                },
                'getByUserId': {
                    method: 'GET',
                    'url': '/api/users/by_id/:user_id'
                },
                'getByEmail': {
                    method: 'GET',
                    'url': '/api/users/by_email/:email'
                }
            });
        }
    ])
    .factory('Email', ['$resource',
        function($resource) {

            return $resource('/api/email/:id', null, {
                'apply': {
                    method: 'POST',
                    url: '/api/email/apply'
                },
                'invite': {
                    method: 'POST',
                    url: '/api/email/invite'
                }
            });
        }
    ])
    .factory('Rating', ['$resource',
        function($resource) {

            return $resource('/api/rating/:id', null, {
                'checkRated': {
                    method: 'GET',
                    url: '/api/rating/rated/:project_id/rated_by/:user_id'
                },
                'projectRating': {
                    method: 'GET',
                    url: '/api/rating/project/:project_id'
                }
            });
        }
    ]);