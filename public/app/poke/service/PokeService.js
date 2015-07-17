'use strict';

angular.module('poke')

    .factory('PokeService', ['$resource',
        
        function($resource) {

            return $resource('/api/poke/:id', null, {
                'get': {
                    method: 'GET'
                }
            });
        }
    ]);