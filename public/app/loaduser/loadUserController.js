'use strict';

angular.module('project')
    .controller('LoadUserController', ['$scope', 'Users', '$location', '$routeParams', 'Credentials', 'store',

        function($scope, Users, $location, $routeParams, Credentials, store) {


            $scope.user = {
                // picture: 'http://placehold.it/200x200',
                country: 'CANADA'
            };

            $scope.isLogin = false;
            $scope.newUser = true;

            $scope.showNewUser = function() {
                $scope.isLogin = false;
                $scope.newUser = true;
            }

            $scope.showLogin = function() {
                $scope.isLogin = true;
                $scope.newUser = false;
            }



            $scope.save = function() {
                var newUser = angular.copy($scope.user);
                newUser.picture = "http://api.adorable.io/avatars/200/" + newUser.name;


                console.log("NEW USER", newUser);
                // return;



                var user = new Users(newUser);
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
                    Users.getByEmail({
                        email: $scope.email
                    }, function(foundUser) {
                        console.log("FOUND foundUser", foundUser);
                        store.set('profile', foundUser);
                        window.location = "/";
                    })
                }
            };
        }
    ])

.controller('HeaderController', ['$scope', 'Projects', '$location', '$routeParams', 'Credentials',
    function($scope, Projects, $location, $routeParams, Credentials) {


        console.log("MMMEEEEE");

        $scope.auth = Credentials.auth();


        console.log('HEADER', $scope.auth, $scope.auth.isAuthenticated);

        $scope.isAdmin = false;

        $scope.$watch('auth.profile', function() {
            if (($scope.auth.profile) && ($scope.auth.profile.email === ADMIN_EMAIL)) {
                $scope.isAdmin = true;
            }
        });

        $scope.login = Credentials.login;
        $scope.logout = Credentials.logout;

        $scope.search = function() {
            window.location = '/search/#/?q=' + $scope.query;
        };

    }
]);