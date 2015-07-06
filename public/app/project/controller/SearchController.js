'use strict';

angular.module('project')
    .controller('SearchController', ['$scope', '$location', '$routeParams', 'auth', 'SecurityService', 'Projects',
        function($scope, $location, $routeParams, auth, SecurityService, Projects) {


            console.log("QUERY", $routeParams);


            var projects = Projects.search({
                q: $routeParams.q,
                country: SecurityService.auth().profile.country
            }, function() {
                console.log("PROJECTS", projects);
                $scope.projects = projects;
            });



        }
    ])

;