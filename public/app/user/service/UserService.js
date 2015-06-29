'use strict';

// TODO : cleanup

angular.module('project')

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
                },
                // Use for loading from GMIS record
                'getSkills': {
                    method: 'GET',
                    'url': '/api/users/skills/:empId'
                },
                'upsertUser': {
                    method: 'POST',
                    'url': '/api/users/skills/'
                }
            });
        }
    ]);