'use strict';

angular.module('user')
    .controller('UserListController', ['$scope', 'Users', '$location', '$routeParams', 'auth', 'Credentials', 'Projects',
        function($scope, Users, $location, $routeParams, auth, Credentials, Projects) {

            $scope.users = Users.query();

        }
    ])
;