'use strict';

angular.module('loaduser')
    .controller('LoadUserController', ['$scope', 'UserService', '$location', '$routeParams', 'store',

        function($scope, UserService, $location, $routeParams, store) {


            $scope.user = {
                // picture: 'http://placehold.it/200x200',
                country: 'CANADA'
            };

            $scope.email = "innovate@hsbc.ca";
            $scope.isLogin = false;
            $scope.newUser = true;

            $scope.showNewUser = function() {
                $scope.isLogin = false;
                $scope.newUser = true;
            };

            $scope.showLogin = function() {
                $scope.isLogin = true;
                $scope.newUser = false;
            };



            $scope.save = function() {
                var newUser = angular.copy($scope.user);
                newUser.picture = newUser.name;


                console.log("NEW USER", newUser);
                // return;



                var user = new UserService(newUser);
                if ($scope.newUser === true) {
                    newUser.status = 'Open';
                    user.$save(function() {
                        console.log('user HAS BEEN CREATED', user);
                        // $location.url('/' + user._id);
                        store.set('profile', user);
                        window.location = "/";
                    });
                } else {
                    // login process
                    // 
                    UserService.getByEmail({
                        email: $scope.email
                    }, function(foundUser) {
                        console.log("FOUND foundUser", foundUser);
                        store.set('profile', foundUser);
                        window.location = "/";
                    })
                }
            };
        }
    ]);
