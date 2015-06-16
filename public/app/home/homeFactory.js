'use strict';



angular.module('home')


.factory('Credentials', ['auth', 'store', '$location', 'Users', '$modal', '$http',
    function(auth, store, $location, Users, $modal, $http) {

        // var login = function(callback) {

        //     // alert("me");
        //     auth.signin({}, function(profile, token) {
        //         // Success callback


        //         var user = profile;

        //         user.role = "regular";
        //         Users.upsert({
        //             user_id: user.user_id
        //         }, user, function(dat) {
        //             console.log("USER HAS BEEN SAVED", user, dat);

        //             profile._id = dat._id;
        //             profile.location = dat.location;
        //             store.set('profile', profile);
        //             store.set('token', token);
        //             $location.path('/');
        //             if (typeof(callback) == "function") {
        //                 callback();
        //             }
        //         })

        //         // console.log("USER INFO",profile);

        //     }, function(err) {
        //         // Error callback

        //         console.log("error", err);
        //     });
        // }


        var login = function(callback) {
            // login modal
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'loginModalContent.html',
                controller: 'loginModalCtrl',
                size: '',
                resolve: {
                    Users: function() {
                        return Users;
                    }
                }
            });
        }

        // var logout = function(callback) {
        //     auth.signout();
        //     store.remove('profile');
        //     store.remove('token');
        //     if (typeof(callback) == "function") {
        //         callback();
        //     }
        //     console.log("GO OUT");
        //     window.location = '/';
        // }
        // 
        var logout = function(callback) {
            store.remove('profile');
            store.remove('token');
            if (typeof(callback) == "function") {
                callback();
            }
            console.log("GO OUT");
            window.location = '/';
        }

        var auth = function() {
            var profile = store.get("profile");

            // console.log("PROFLE GET", profile);
            if (profile !== null) {
                // console.log("AUTOLOGIN", profile);
                return {
                    isAuthenticated: true,
                    profile: profile
                }
            } else {
                // return {
                //     isAuthenticated: false,
                //     profile: {}
                // }
                // enable auto login
                // console.log("ENABLE AUTO LOGGIN");
                autoLogin(function(user) {
                    store.set("profile", user);
                    // console.log("CALLBACK _ AUTOLOGIN", user);
                    window.location.reload();

                });
            }
        }


        var parseLoginInfo = function(data) {
            var lines = data.split(';');
            var user = {};


            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                // console.log("LINE", line);
                if (line !== "") {
                    var field = line.split('=')[0].replace("var", "").trim();
                    var value = line.split("='")[1].replace("'", "").replace('"', '').trim();
                    // console.log("XXXX", field, value);
                    switch (field) {
                        case 'staffDetails_name':
                            user.name = value;
                            if (value.split(" ").length == 2) {
                                user.family_name = value.split(" ")[1];
                                user.given_name = value.split(" ")[0];
                            } else {
                                user.family_name = "";
                                user.given_name = "";
                            }
                            break;
                        case 'staffDetails_extphone':
                            user.phone = value;
                            break;
                        case 'staffDetails_country':
                            user.country = value;
                            break;
                        case 'staffDetails_jobrole':
                            user.job_role = value;
                            break;
                        case 'staffDetails_dept':
                            user.dept = value;
                            break;
                        case 'staffDetails_photourl':
                            user.picture = value;
                            break;
                        case 'staffDetails_extemail':
                            user.email = value;
                            if (value.split("@").length == 2) {
                                user.nickname = value.split("@")[0];
                            } else {
                                user.nickname = value;
                            }
                            user.email_verified = true;
                            break;
                        default:
                            ;
                    }
                }

            };

            console.log("PARSED USER", user);

            return user;
        }

        var autoLogin = function(callback) {


            var BASE = "http://" + window.location.host;
            console.log("BASE", BASE);
            $http.get(BASE + '/api/users/fake_login').
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                // parseLoginInfo(data);
                // console.log("LOADED DATA", data);


                var user = new Users(parseLoginInfo(data));
                user.$save(function(data) {
                    // console.log("SAVED USER", data);
                    if (typeof(callback) == "function") {
                        callback(data);
                    }
                })
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert("cannot auto login");
                window.location.reload();
            });
        }

        return {
            'login': login,
            'logout': logout,
            'auth': auth,
            'autoLogin': autoLogin
        };
    }
]);