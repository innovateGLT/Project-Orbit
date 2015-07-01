'use strict';

angular.module('project')
    .controller('UserListController', ['$scope', 'Users', '$location', '$routeParams', 'auth', 'Credentials', 'Projects',
        function($scope, Users, $location, $routeParams, auth, Credentials, Projects) {

            $scope.users = Users.query();
            
            $scope.names = ['Igor Minar', 'Brad Green', 'Dave Geddes', 'Naomi Black', 'Greg Weber', 'Dean Sofer', 'Wes Alvaro', 'John Scott', 'Daniel Nadasi'];

        }
    ])

;