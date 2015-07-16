'use strict';

angular.module('help')

    .factory('ContactUsService', ['$resource',
        
        function($resource) {

            return $resource('/api/contact-us/:id', null, {
                
            });
        }
    ]);