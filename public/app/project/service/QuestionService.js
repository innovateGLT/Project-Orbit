'use strict';



angular.module('project')

.factory('Questions', ['$resource',
    function($resource) {

        return $resource('/api/questions/:id', null, {
            'update': {
                method: 'PUT'
            },
            'get': {
                method: 'GET'
            }
        });
    }
]);