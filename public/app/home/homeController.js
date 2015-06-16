'use strict';


angular.module('home')
    .controller('HomeController', function(auth, $scope, store, $location, Users, Credentials, Projects, $interval) {



        $scope.auth = Credentials.auth();

        console.log("AUTH VARIABLE HERE", $scope.auth);
        $scope.videoUrl = "/app/assets/video/BANNER_VANCOUVER.mp4";
        $scope.posterUrl = "/app/assets/img/sky.jpg";
        var myVideo = document.getElementsByTagName('video')[0];

        var animatedBG = function(location) {
            if (location != null) {
                // $scope.imgUrl = "/app/assets/img/bg/" + location + "/1.jpg";
                $scope.videoUrl = "/app/assets/video/BANNER_VANCOUVER.mp4";
                $scope.posterUrl = "/app/assets/img/bg/" + location + "/1.jpg";
            } else {
                $scope.videoUrl = "/app/assets/video/undefined.mp4";
                $scope.posterUrl = "/app/assets/img/bg/" + location + "/1.jpg";
            }

            myVideo.src = $scope.videoUrl;


            var index = 2;
            var totalImage = 4;

            $interval(function() {
                $scope.posterUrl = "/app/assets/img/bg/" + location + "/" + index + ".jpg";
                $scope.videoUrl = "/app/assets/video/undefined.mp4";
                index += 1;

                console.log("TESING", $scope.videoUrl, $scope.posterUrl);

                if (index > totalImage) {
                    index = 1;
                    $scope.videoUrl = "/app/assets/video/BANNER_VANCOUVER.mp4";
                    $scope.posterUrl = "/app/assets/img/bg/" + location + "/1.jpg";
                }

                myVideo.src = $scope.videoUrl;
            }, 10000);
        }

        $scope.login = function() {
            Credentials.login(function() {
                var location = store.get("profile").location;

                if (location != null) {
                    $scope.imgUrl = "/app/assets/img/bg/" + location + "/1.jpg";
                } else {
                    $scope.imgUrl = "";
                }

                animatedBG(location);
            });
        }

        $scope.logout = function() {
            Credentials.logout(function() {
                $scope.location = null;
            });
        }

        if (auth.isAuthenticated) {
            var location = store.get("profile").location;
            animatedBG(location);


        }





        $scope.featuredProjects = Projects.featured({
            country: $scope.auth.profile.country
        });

        $scope.featuredUsers = Users.featured({
            country: $scope.auth.profile.country
        });

        $scope.projectOwnerSelected = false;
        $scope.projectSeekerSelected = false;
        $scope.selectProjectSeeker = function() {

            if ($scope.projectSeekerSelected == true) {
                $scope.projectSeekerSelected = false;
            } else {
                $scope.projectOwnerSelected = false;
                $scope.projectSeekerSelected = true;
            }

        }

        $scope.selectProjectOwner = function() {

            if ($scope.projectOwnerSelected == true) {
                $scope.projectOwnerSelected = false;
            } else {
                $scope.projectOwnerSelected = true;
                $scope.projectSeekerSelected = false;
            }

        }

        $scope.search = function() {
            window.location = "/search/#/?q=" + $scope.query;
        }

        $scope.go = function(path) {
            window.location = path;
        };




    });