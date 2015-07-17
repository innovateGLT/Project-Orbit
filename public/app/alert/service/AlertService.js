'use strict';

angular.module('alert')

    .factory('AlertService', ['$resource',
        
        function($resource) {

            return $resource('/api/alert/:id', null, {
                'get': {
                    method: 'GET'
                }
            });
        }
    ]);