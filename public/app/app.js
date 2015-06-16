'use strict';

var ADMIN_EMAIL = 'schoolservice2@gmail.com';



// app.js
angular.module('app', ['auth0', 'project', 'home', 'angular-storage', 'angular-jwt']);

angular.module('app').controller('loginModalCtrl', function($scope, $modalInstance, Users, store, $location) {

    $scope.error = false;

    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.signin = function() {


        if (($scope.username == "") && ($scope.password == "")) {
            swal("Error!", "Please enter username and password", "error");
            return;
        }

        Users.login({
            username: $scope.username,
            password: $scope.password
        }, function(result) {
            // login failed
            if (result.status === false) {
                $scope.error = true;
                $scope.errorMessage = result.error;
                $scope.username = "";
                $scope.password = "";
            } else {
                // login successful
                $scope.error = false;
                store.set("profile", result.user);
                console.log("STORE PROFILE", store.get("profile"));
                window.location.reload();
            }
        })
    }
});