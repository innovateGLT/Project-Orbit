'use strict';



angular.module('home')


.factory('SecurityService', ['auth', 'store', '$location', 'UserService', '$modal', '$http', '$q',
    function(auth, store, $location, UserService, $modal, $http, $q) {

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
        };

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
        };

        /*var auth = function() {
            var profile = getProfile();

            // console.log("PROFLE GET", profile);
            if (profile !== null) {
                // console.log("AUTOLOGIN", profile);

                return {
                    isAuthenticated: true,
                    profile: profile
                }
            } else {
            	   loadUserInfo().then(function(userInfo) {
	                   var user = new UserService(userInfo);
	                   user.$save(function(data) {
	                	   store.set("profile", data);
	                	   store.set("profile_lastUpdatedTime", new Date().getTime().toString());
	                	   window.location.reload();
	                   });
            	   });
            }
        };*/
        
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
        };
        
        var loadUserInfo = function () {
            // summary
            //      this method would load the users retrieve from the common API to an object
            // return
            //      an object that contains all the user information
            // tags
            //      private
        	var deferred = $q.defer();
            var user = {};
            
            // user employee name
            if (staffDetails_name.split(" ").length == 2) {
                user.family_name = staffDetails_name.toProperCase().split(" ")[1];
                user.given_name = staffDetails_name.toProperCase().split(" ")[0];
            } else {
                user.family_name = "";
                user.given_name = "";
            }
            
            user.name = staffDetails_name.toProperCase();
            user.empId = staffDetails_empid;
            user.phone = staffDetails_extphone;
            user.country = staffDetails_country.toUpperCase();
            user.job_role = staffDetails_jobrole;
            user.dept = staffDetails_dept;
            user.picture = "http://" + staffDetails_photourl;
            user.email = staffDetails_extemail;
            user.email_verified = true;

            user.nickname = staffDetails_name.split(" ")[0].toProperCase();
            
            // Loading of GMIS skills into user profile
            console.log("Loading GMIS skills into profile...");
            UserService.getSkills({empId: user.empId}, function (response) {
                // Convert skill list to simple array, use for updating 'User' object.  This is temporary.
                // The original array contains more information, e.g. rating, category, etc. and will
                // be used later for generating bubble chart and such.
                if(response.person) {
                    var simpleSkillList = [];
                  
                    response.person.skills.forEach(function(skill) {
                        simpleSkillList.push(skill.skill);
                    });
                    user.skills = simpleSkillList;
                    console.log("GMIS data populated.");
                }
                return deferred.resolve(user);
            });
            return deferred.promise;
        };


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
            console.log("BASE", BASE + '/api/users/fake_login'); // 
            $http.get(BASE + '/api/users/fake_login').
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                // parseLoginInfo(data);
                // console.log("LOADED DATA", data);


                var user = new UserService(parseLoginInfo(data));
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
        };
        
        // Retrieve profile from storage and check the lastUpdated time.
        // If lastUpdated is over 1 hour old, purge the storage.
        var getProfile = function() {
        	var lastUpdatedTime = store.get("profile_lastUpdatedTime")
        	if(lastUpdatedTime) {
        		if(new Date().getTime().toString() - lastUpdatedTime >= 3600000) {
        			store.remove("profile");
        			store.remove("profile_lastUpdatedTime");
        		} else {
        			return store.get("profile");
        		}
        	}
        	return null;
        }

        return {
            'login': login,
            'logout': logout,
            'auth': auth,
            'autoLogin': autoLogin
        };
    }
]);