'use strict';


angular.module('home')

    .controller('HomeController', function(auth, $scope, store, $location, UserService, SecurityService, Projects, $interval, AlertService, SweetAlert) {

        $scope.auth = SecurityService.auth();

        console.log("AUTH VARIABLE HERE", $scope.auth);
        //        $scope.posterUrl = "/app/assets/img/sky.png";
        var myVideo = document.getElementsByTagName('video')[0];
        var location = $scope.auth.profile.country;
        $scope.videoUrl = "/app/assets/video/BANNER_" + location + ".mp4";

        var animatedBG = function(location) {
            if (location != null) {
//                var location_nospace = location.replace(/\s/g, '');
                $scope.videoUrl = "/app/assets/video/BANNER_"+ location + ".mp4";
  //              $scope.posterUrl = "/app/assets/img/bg/" + location + "/1.jpg";
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
        };

        $scope.login = function() {
            SecurityService.login(function() {
                var location = store.get("profile").location;

                if (location != null) {
                    $scope.imgUrl = "/app/assets/img/bg/" + location + "/1.jpg";
                } else {
                    $scope.imgUrl = "";
                }

                animatedBG(location);
            });
        };

        $scope.logout = function() {
            SecurityService.logout(function() {
                $scope.location = null;
            });
        };

        if (auth.isAuthenticated) {
            var location = store.get("profile").location;
            animatedBG(location);


        }

        $scope.featuredProjects = Projects.featured({
            country: $scope.auth.profile.country
        });

        UserService.featured({
            country: $scope.auth.profile.country
        }, function ( featuredUsers ) {
            
            $scope.featuredUsers = featuredUsers;
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

        };

        $scope.selectProjectOwner = function() {

            if ($scope.projectOwnerSelected == true) {
                $scope.projectOwnerSelected = false;
            } else {
                $scope.projectOwnerSelected = true;
                $scope.projectSeekerSelected = false;
            }

        };

        $scope.search = function() {
            $location.path('/search').search({q: $scope.query});
        };

        $scope.go = function(path) {
            window.location = path;
        };
        
        $scope.returnUrl = $location.path();
        
        $scope.isNotificationVisible = false;
        $scope.toggleNotifications = function () {
            // summary
            //      this function would retrieve all notifications of the user, triggered by the bell button from the navbar
            // tags
            //      private
            if ( !$scope.isNotificationVisible ) {
                AlertService.query({user_id : $scope.auth.profile.user_id}, function ( notifications ) {
                    $scope.notifications = notifications;
                });
            }
            $scope.isNotificationVisible = $scope.isNotificationVisible ? false : true;
        };
        
        $scope.viewUser = function ( /* String */alert ) {
            // summary
            //      redirect the user to the user profile page
            //      we would delete the invite alert once clicked
            // params
            //      alert - the alert object
            // tags
            //      private
            
            $scope.isNotificationVisible = false;
            $scope.deleteAlert( alert );
            $location.path("/user/" + alert.by_user.user_id).hash( $scope.returnUrl );
        }
        
        $scope.viewProject = function ( /* Object */alert ) {
            // summary
            //      redirect the user to the project details page
            //      we would delete the invite alert once clicked
            // params
            //      alert - the alert object
            // tags
            //      private
            
            $scope.isNotificationVisible = false;
            $scope.deleteAlert( alert );
            $location.path("/project/" + alert.project_id).hash( $scope.returnUrl );
        };
        
        $scope.deleteAlert = function ( /* Object */alert ) {
            // summary
            //      this function would delete the alert
            // params
            //      alert - the alert to be deleted
            
            AlertService.delete({id: alert._id}, function () {
                var index = $scope.notifications.indexOf(alert);
                $scope.notifications.splice(index, 1);
                console.log($scope.notifications.length);
            });
        };
        
        $scope.viewAlert = function( /* String */alert ) {
            // summary
            //      view the alert, determine which one to trigger by alert_type
            // params
            //      alert - the alert object
            // tags
            //      private
            
            if ( alert.alert_type === "accept" || alert.alert_type === "poke" ) {
                $scope.viewUser( alert );
            } else if ( alert.alert_type === "invite" ) {
                $scope.viewInviteAlert( alert );
            } else {
                $scope.viewProject( alert );
            }
        };
        
        $scope.viewInviteAlert = function ( /* Object */alert ) {
            // summary
            //      this function would open a SweetAlert popup showing the message in the invite
            //      user can just ignore it or view the project
            // params
            //      alert - the alert object
            // tags
            //      private
            SweetAlert.swal({
                html:true,
                title: "Project Invitation",
                text: '<div class="left ml10" style="width:30px;">' + 
                          '<a class="pointer"><img src="' + alert.by_user.picture + '" width="30px" class="media-object img-circle" title="' + alert.by_user.name + '"/></a>' +
                      '</div>'+
                      '<div class="bubble">' +
                          '<div class="text-left small">"' + alert.message + ' "</div>' +
                      '</div>',
                type: "info",
                showCancelButton: true,
                confirmButtonText: "View Project",
                closeOnConfirm: true
            }, function( isConfirm ) {
                
                if ( isConfirm ) {
                    $scope.viewProject( alert );
                }

            });
        };

        // default to 10 seconds
        $scope.retrieveAlertInterval = 10;
        $scope.alertThread = $interval(getAlerts, $scope.retrieveAlertInterval * 1000);

        function getAlerts() {
            
            console.log("interval : " + $scope.retrieveAlertInterval);
            
            AlertService.query({user_id : $scope.auth.profile.user_id}, function ( notifications ) {
                $scope.notifications = notifications;
                
                // if there are no new notifications, we assume that the user is not actively working on something, hence we increase the interval
                if ( notifications.length === 0 ) {
                    $scope.retrieveAlertInterval+= 5;
                    
                    $interval.cancel($scope.alertThread);
                    
                    $scope.alertThread = $interval(getAlerts, $scope.retrieveAlertInterval * 1000);
                } else {
                    $scope.retrieveAlertInterval = 1;
                }
            });
        }

        // listen to location changes, just so we could retrieve new notifications, just in case the interval is already so long
        $scope.$on("location-changed", function (event, location) {
            getAlerts();
        });

        getAlerts();

    });