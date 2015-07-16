'use strict';

angular.module('help')

    .factory('FeedbackService', ['$resource',
        
        function($resource) {

            return $resource('/api/feedback/:id', null, {
                
            });
        }
    ]);