'use strict';

angular.module('user')
    .controller('UserListController', ['$scope', 'UserService', 'auth', 'Projects',
        function($scope, UserService, auth, Projects) {

            $scope.users = UserService.query();

        }
    ])
;