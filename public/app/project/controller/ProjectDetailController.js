'use strict';

angular.module('project')
    .controller('ProjectDetailController', ['$scope', '$routeParams', '$window', 'Projects', '$location', 'Questions', 'SecurityService', 'UserService', 'SweetAlert', 'Email', 'Rating', 'store', 'AlertService','Analytics',
        function($scope, $routeParams, $window, Projects, $location, Questions, SecurityService, UserService, SweetAlert, Email, Rating, store, AlertService, Analytics) {

            $scope.auth = SecurityService.auth();

            $scope.isAdmin = false;
            $scope.projectFullStars = [];
            $scope.projectEmptyStars = [1, 2, 3, 4, 5];


            var getProjectRating = function(projectId) {
                Rating.projectRating({
                    project_id: projectId
                }, function(pr) {
                    // console.log("HERE IS THE PROJECT RATING",pr);
                    var projectFullStars = [];
                    for (var i = 0; i < Math.round(pr.value); i++) {
                        projectFullStars.push(i);
                    };
                    $scope.projectFullStars = projectFullStars;

                    var projectEmptyStars = [];
                    for (var i = 0; i < (5 - Math.round(pr.value)); i++) {
                        projectEmptyStars.push(i);
                    };
                    $scope.projectEmptyStars = projectEmptyStars;

                    $scope.projectPeoplesRating = pr.count;
                });
            };


            Projects.get({
                id: $routeParams.id
            }, function( project ) {

                $scope.project = project;
                $scope.project.picture = "/app/assets/img/categories/full/" + project.category + ".png";

                if ($scope.auth.profile.user_id == $scope.project.user.user_id) {
                    $scope.isOwner = true;
                } else {
                    $scope.isOwner = false;
                }
                
                if ($scope.auth.profile.email == ADMIN_EMAIL) {
                    $scope.isOwner = true;
                    $scope.isAdmin = true;
                }

                // check if the user has been selected
                $scope.hasAccepted = $scope.isUserSelected( $scope.auth.profile );

                $scope.matchedUsers = UserService.getMatches({
                    skills: $scope.project.skillset.join(',')
                }, function() {
                    
                    // remove the project owner from the list of matched users
                    $scope.matchedUsers = $scope.matchedUsers.filter(function(person) {
                        console.log("sXXXX", $scope.project.user.user_id);
                        return person.user_id != $scope.project.user.user_id;
                    });

                    // remove all applied users who have been selected by the owner
                    $scope.rateUserInitCount = 0;
                    for (var i = 0; i < $scope.project.selectedUsers.length; i++) {
                        var userId = $scope.project.selectedUsers[i].user_id;
                        $scope.project.appliedUsers = $scope.project.appliedUsers.filter(function(person) {
                            return person.user_id != userId;
                        });


                        // check if the current logged-in user has been selected for this project
                        if ($scope.auth.profile.user_id == userId) {
                            $scope.logginUserSelectedForProject = true;
                        }


                        // ability to rate the selected people
                        if ($scope.project.selectedUsers[i].rate == undefined) {
                            $scope.project.selectedUsers[i].rate = 0;
                            $scope.project.selectedUsers[i].isReadonly = false;
                        } else {

                            if ($scope.project.selectedUsers[i].rate == 0) {
                                $scope.project.selectedUsers[i].isReadonly = false;
                            } else {
                                $scope.project.selectedUsers[i].isReadonly = true;
                            }

                        }


                        $scope.$watch("project.selectedUsers[" + i + "].rate", function(rate, a, b) {
                            $scope.rateUserInitCount += 1;

                            if ($scope.rateUserInitCount <= $scope.project.selectedUsers.length) {
                                return;
                            };

                            SweetAlert.swal("Done!", "You have rated the team member " + rate + " star" + (rate > 1 ? "s" : "") + ".", "success");

                            for (var i = 0; i < $scope.project.selectedUsers.length; i++) {
                                if ($scope.project.selectedUsers[i].rate == 0) {
                                    $scope.project.selectedUsers[i].isReadonly = false;
                                } else {
                                    $scope.project.selectedUsers[i].isReadonly = true;
                                }
                            };

                            Projects.update({
                                id: $scope.project._id
                            }, $scope.project);
                            
                            console.log("PROJECT HAS BEEN UPDATED", $scope.project);
                        })

                    };

                    console.log("SELECTED USER", $scope.project.selectedUsers);


                    // remove all matched users who have been applied 
                    for (var i = 0; i < $scope.project.appliedUsers.length; i++) {
                        if ( $scope.project.appliedUsers[i] ) {
                            var user_id = $scope.project.appliedUsers[i].user_id;
                            $scope.matchedUsers = $scope.matchedUsers.filter(function(person) {
                                return person.user_id != user_id;
                            });
                        }
                    };

                    // remove all matched users who have been selected
                    for (var i = 0; i < $scope.project.selectedUsers.length; i++) {
                        if ( $scope.project.selectedUsers[i] ) {
                            var user__id = $scope.project.selectedUsers[i].user_id;
                            $scope.matchedUsers = $scope.matchedUsers.filter(function(person) {
                                return person.user_id != user__id;
                            });
                        }
                    };

                    // set invited to all matched users who has been invited already
                    for (var i = 0; i < $scope.project.invitedUsers.length; i++) {
                        if ( $scope.project.invitedUsers[i] ) {
                            var user___id = $scope.project.invitedUsers[i].user_id;
                            if ( user___id ) {
                                $scope.matchedUsers.forEach(function(person) {
                                    if ( person.user_id == user___id ) {
                                        person.invited = true;
                                    }
                                });
                            }
                        }
                    };



                    console.log("MATCHED USERS", $scope.matchedUsers);

                });


                $scope.hasApplied = false;
                for (var i = 0; i < $scope.project.appliedUsers.length; i++) {
                    if ( $scope.project.appliedUsers[i] ) {
                        if ($scope.auth.profile.user_id == $scope.project.appliedUsers[i].user_id) {
                            $scope.hasApplied = true;
                        }
                    }
                };

                // check if the loggined user has been invited to this project
                $scope.hasBeenInvited = false;
                for (var i = 0; i < $scope.project.invitedUsers.length; i++) {
                    if ($scope.auth.profile.user_id == $scope.project.invitedUsers[i].user_id) {
                        $scope.hasBeenInvited = true;
                    }
                };

                // check if user has been selected
                for (var i = 0; i < $scope.project.selectedUsers.length; i++) {
                    if ($scope.auth.profile.user_id == $scope.project.selectedUsers[i].user_id) {
                        $scope.hasBeenInvited = false;
                    }
                };



                // get the project rating
                getProjectRating($scope.project._id);


                //check if the current user can rate the project
                if ($scope.auth.isAuthenticated) {
                    Rating.checkRated({
                        project_id: $scope.project._id,
                        user_id: store.get('profile')._id
                    }, function(dat) {
                        // console.log("DTEAERAE",dat);
                        if (dat.rated == true) {
                            $scope.isReadonly = true;
                            $scope.rate = dat.value;
                            $scope.isRated = true;
                        } else {
                            $scope.isRated = false;
                            $scope.isReadonly = false;
                            $scope.rate = 0;
                            $scope.$watch('rate', function(rate) {
                                if ($scope.rateInit == true) {
                                    $scope.rateInit = false;
                                    return;
                                }

                                var rating = new Rating({
                                    project_id: $scope.project._id,
                                    owner_id: $scope.project.user.user_id,
                                    rated_by: store.get('profile')._id,
                                    value: rate
                                });
                                rating.$save(function() {
                                    // alert("DONE");
                                    getProjectRating($scope.project._id);
                                });

                                $scope.isReadonly = true;
                                $scope.isRated = true;

                                SweetAlert.swal("Done!", "You have rated the opportunity owner " + rate + " star" + (rate > 1 ? "s" : "") + ". \n You cannot rate anymore", "success");
                                $scope.isReadonly = true;
                            });
                        }
                    });
                }


                // remove if matched people is the owner
                console.log("CURRENT PROJECT", $scope.project);
            });

            $scope.questions = Questions.query({
                project_id: $routeParams.id
            }, function() {

                // console.log($scope.questions,"MY QUESTION");

            });

            $scope.showQuestion = true;

            $scope.showAsk = false;

            $scope.update = function() {


                Projects.update({
                    id: $scope.project._id
                }, $scope.project, function() {
                    $location.url('/');
                });
            };

            $scope.delete = function() {
                SweetAlert.swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this project!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, remove it",
                    closeOnConfirm: false
                }, function( isConfirm ) {
                    
                    if ( isConfirm ) {
                        Projects.remove({
                            id: $scope.project._id
                        }, function() {
                            SweetAlert.swal({
                                title: "Removed!",
                                text: "The project has been removed! You will go to the homepage",
                                type: "success",
                                showCancelButton: false,
                                confirmTextButton: "Go"
                            }, function() {
                                $location.path("/");
                            });
    
                        });
                    }

                });

            };

            $scope.ask = function() {
                $scope.showAsk = true;
            };


            $scope.submitComment = function() {

                if ( $scope.comment ) {
                    var newQuestion = {
                        content: $scope.comment,
                        project_id: $scope.project._id,
                        user: {
                            name: $scope.auth.profile.name,
                            user_id: $scope.auth.profile.user_id,
                            picture: $scope.auth.profile.picture,
                        }
                    };
                    var question = new Questions(newQuestion);
                    question.$save(function() {
                        console.log("question HAS BEEN CREATED", question);
                        $scope.questions.unshift(question);
                        $scope.question = "";
                        SweetAlert.swal("Done!", "Your message has been posted!", "success");
                        $scope.comment = "";
                        
                        // alert all selected users and project owner
                        $scope.generateCommentAlert();
                    });
                    console.log($scope.question);
                } else {
                    SweetAlert.swal('Error!', 'Please enter a comment', 'error');
                }
            };


            $scope.showQuestions = function() {
                $scope.showQuestion = true;
            }


            $scope.apply = function() {
                $scope.project = Projects.apply({
                    project_id: $scope.project._id,
                    user_id: $scope.auth.profile.user_id,
                    name: $scope.auth.profile.name

                }, function() {
                    console.log("APPPLIED PROJECT", $scope.project);
                    $scope.hasApplied = true;

                    UserService.getByUserId({
                        user_id: $scope.project.user.user_id
                    }, function(newUser) {
                        if (newUser.email == "") {
                            SweetAlert.swal("Error!", "This user has no email. We cannot send the invitation", "error");
                            return;
                        }

                        SweetAlert.swal({
                            title: "Application",
                            text: "Write your own message to the email " + newUser.email,
                            type: "input",
                            showCancelButton: true,
                            closeOnConfirm: false,
                            animation: "slide-from-top",
                            inputPlaceholder: "Your message..."
                        }, function(inputValue) {
                            if (inputValue === false) return false;
                            if (inputValue === "") {
                                SweetAlert.swal.showInputError("You need to write something before sending your application!");
                                return false;
                            }

                            Email.apply({
                                owner_email: newUser.email,
                                owner_name: newUser.name,
                                username: $scope.auth.profile.name,
                                user_id: $scope.auth.profile.user_id,
                                project_name: $scope.project.title,
                                project_id: $scope.project._id,
                                content: inputValue
                            }, function() {
                                console.log("Apply for a project - Email has been sent");

                            });

                            $scope.generateApplyAlert( newUser );
                            SweetAlert.swal("Done!", "You applied to the project! An email has been sent to the owner " + newUser.email, "success");

                        });

                    });
                });
            };

            $scope.invite = function(user) {
                console.log(user);

                var invitedUser = {
                    user_id: user.user_id,
                    name: user.name
                };

                var invited = false;
                for (var i = 0; i < $scope.project.invitedUsers.length; i++) {
                    if ( $scope.project.invitedUsers[i] && invitedUser.user_id == $scope.project.invitedUsers[i].user_id) {
                        invited = true;
                    }
                };
                if ( invited ) {
                    // poke!
                    $scope.poke( user );
                    return;
                }

                UserService.getByUserId({
                    user_id: user.user_id
                }, function(newUser) {
                    if (newUser.email == "") {
                        SweetAlert.swal("Error!", "This user has no email. We cannot send the invitation", "error");
                        return;
                    }

                    SweetAlert.swal({
                        title: "Invitation",
                        text: "Write your own message to the email " + newUser.email,
                        type: "input",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        animation: "slide-from-top",
                        inputPlaceholder: "Your message..."
                    }, function(inputValue) {
                        if (inputValue === false) return false;
                        if (inputValue === "") {
                            SweetAlert.swal.showInputError("You need to write something before sending an inviation!");
                            return false;
                        }

                        if ( !invited ) {
                            $scope.project.invitedUsers.push(invitedUser);
                            user.invited = true;
                        }

                        Email.invite({
                            username: newUser.name,
                            user_id: newUser.user_id,
                            user_email: newUser.email,
                            project_name: $scope.project.title,
                            project_id: $scope.project._id,
                            content: inputValue
                        }, function() {
                            console.log("Email has been sent");
                        });
                        Projects.update({
                            id: $scope.project._id
                        }, $scope.project, function() {

                        });

                        // generate invite alert
                        $scope.generateInviteAlert( user, inputValue );
                        SweetAlert.swal("Nice!", "The user has been invited", "success");
                        
                    });

                });

            };

            // rate the project owner
            $scope.generateRateProjectOwnerAlert = function () {
                var rateAlert = {
                    by_user : {
                        user_id : $scope.auth.profile.user_id,
                        name: $scope.auth.profile.name,
                        picture: $scope.auth.profile.picture
                    },
                    
                    for_user: {
                        user_id : $scope.project.user.user_id,
                        name: $scope.project.user.name,
                        picture: $scope.project.user.picture
                    },
                    
                    alert_type: "rate-project-owner",
                    
                    project_name: $scope.project.title,
                    
                    project_id: $scope.project._id,
                    
                    message: $scope.rate
                };
                
                var rateAlertRecord = new AlertService(rateAlert);
                rateAlertRecord.$save().then(function ( response ) {
                    console.log("Rate Project Owner alert generated : " + response);
                });
            };

            // rate a team member
            $scope.generateRateAlert = function ( /* Object */user ) {
                var rateAlert = {
                    by_user : {
                        user_id : $scope.auth.profile.user_id,
                        name: $scope.auth.profile.name,
                        picture: $scope.auth.profile.picture
                    },
                    
                    for_user: {
                        user_id : user.user_id,
                        name: user.name,
                        picture: user.picture
                    },
                    
                    alert_type: "rate",
                    
                    project_name: $scope.project.title,
                    
                    project_id: $scope.project._id,
                    
                    message: user.rate
                };
                
                var rateAlertRecord = new AlertService(rateAlert);
                rateAlertRecord.$save().then(function ( response ) {
                    console.log("Rate alert generated : " + response);
                });
            };

            // the project owner and the selected people will get this alert
            $scope.generateCommentAlert = function ( /* Object */user ) {
                var commentAlert = {
                    by_user : {
                        user_id : $scope.auth.profile.user_id,
                        name: $scope.auth.profile.name,
                        picture: $scope.auth.profile.picture
                    },
                    
                    alert_type: "comment",
                    
                    project_name: $scope.project.title,
                    
                    project_id: $scope.project._id
                };
                
                AlertService.comment(commentAlert, function ( response ) {
                    console.log("Comment alert generated : " + response);
                });
            };
            
            $scope.generateApplyAlert = function ( /* Object */user ) {
                var applyAlert = {
                    by_user : {
                        user_id : $scope.auth.profile.user_id,
                        name: $scope.auth.profile.name,
                        picture: $scope.auth.profile.picture
                    },
                    
                    for_user : {
                        user_id : user.user_id,
                        name: user.name,
                        picture: user.picture
                    },
                    
                    alert_type: "apply",
                    
                    project_name: $scope.project.title,
                    
                    project_id: $scope.project._id
                };
                
                var applyRecord = new AlertService(applyAlert);
                applyRecord.$save().then(function ( response ) {
                    console.log("Apply alert generated.");
                });
            };
            
            $scope.generateAcceptApplicationAlert = function ( /* Object */user ) {
                var acceptApplicationAlert = {
                    by_user : {
                        user_id : $scope.auth.profile.user_id,
                        name: $scope.auth.profile.name,
                        picture: $scope.auth.profile.picture
                    },
                    
                    for_user : {
                        user_id : user.user_id,
                        name: user.name,
                        picture: user.picture
                    },
                    
                    alert_type: "accept-application",
                    
                    project_name: $scope.project.title,
                    
                    project_id: $scope.project._id
                };
                
                var acceptApplication = new AlertService(acceptApplicationAlert);
                acceptApplication.$save().then(function ( response ) {
                    console.log("Accepted application alert generated.");
                });
            };
            
            $scope.generateAcceptAlert = function ( /* Object */user ) {
                var acceptAlert = {
                    by_user : {
                        user_id : $scope.auth.profile.user_id,
                        name: $scope.auth.profile.name,
                        picture: $scope.auth.profile.picture
                    },
                    
                    for_user : {
                        user_id : user.user_id,
                        name: user.name,
                        picture: user.picture
                    },
                    
                    alert_type: "accept",
                    
                    project_name: $scope.project.title,
                    
                    project_id: $scope.project._id
                };
                
                var acceptRecord = new AlertService(acceptAlert);
                acceptRecord.$save().then(function ( response ) {
                    console.log("Accept alert generated.");
                });
            };
            
            $scope.generateInviteAlert = function ( /* Object */user, /* String */inviteMessage ) {
                var inviteAlert = {
                    by_user : {
                        user_id : $scope.auth.profile.user_id,
                        name: $scope.auth.profile.name,
                        picture: $scope.auth.profile.picture
                    },
                    
                    for_user : {
                        user_id : user.user_id,
                        name: user.name,
                        picture: user.picture
                    },
                    
                    alert_type: "invite",
                    
                    project_name: $scope.project.title,
                    
                    project_id: $scope.project._id,
                    
                    message: inviteMessage
                };
                
                var inviteRecord = new AlertService(inviteAlert);
                inviteRecord.$save().then(function ( response ) {
                    console.log("Invite alert generated.");
                });
            };
            
            $scope.poke = function ( /* Object */user ) {
                // summary
                //      this functions pokes a matched employee
                //      poke is only available once the user has already been invited but hasn't responded yet
                
                // if the user has been invited, the project owner could notify the user again just by poking
                // the poked user would see a notification once he logs in to the site
                // once he viewed the poke notification, we would remove the poke notification, thus the project owner could poke the user again
                
                var poke = {};
                var pokeHurts = false;
                if ( !user.pokes ) {
                    user.pokes = [];
                }
                
                // if the project owner hasn't poked the user yet
                if ( !pokeHurts ) {
                    
                    poke = {
                        by_user : {
                            user_id : $scope.auth.profile.user_id,
                            name: $scope.auth.profile.name,
                            picture: $scope.auth.profile.picture
                        },
                        
                        for_user : {
                            user_id : user.user_id,
                            name: user.name,
                            picture: user.picture
                        },
                        
                        alert_type: "poke"
                    };
                    
                    // save poke
                    var pokeRecord = new AlertService(poke);
                    pokeRecord.$save().then(function ( response ) {
                        
                        if ( response.error ) {
                            SweetAlert.swal("Awww!", "Too much poking, it hurts.", "error");
                            pokeHurts = true;
                        } else {
                            SweetAlert.swal("Pokey poke!", "We've alerted the user that you really wanted them in your team.", "success");
                        }
                    });
                
                // poke already hurts, coz user has been poked 5 times
                } else {
                    SweetAlert.swal("Awww!", "Too much poking, it hurts.", "error");
                }
                    
            };

            $scope.feature = function() {
                $scope.project.featured = !$scope.project.featured;

                Projects.update({
                    id: $scope.project._id
                }, $scope.project, function() {

                    if ($scope.project.featured == true) {
                        SweetAlert.swal("Featured Project!", "The project has been marked to be featured!", "success");
                    } else {
                        SweetAlert.swal("Regular Project!", "The featured project has been unmarked!", "success");
                    }

                });
            }


            $scope.acceptInvitation = function( profile ) {
                var user = {
                    user_id: profile.user_id,
                    name: profile.name,
                    picture: profile.picture
                };

                // if user is not yet selected
                if ( !$scope.isUserSelected( user ) ) {
                    
                    // set that the user has accepted the invitation
                    $scope.hasAccepted = true;
                    
                    $scope.project.selectedUsers.push(user);
                    
                    // user should now see the list of selected people in the project
                    $scope.logginUserSelectedForProject = true;
                                        
                    // remove the user from the list of invited users
                    var refreshedListOfInvitedUsers = [];
                    for (var i = 0; i < $scope.project.invitedUsers.length; i++) {
                        if (user.user_id != $scope.project.invitedUsers[i].user_id) {
                            refreshedListOfInvitedUsers[i] = $scope.project.invitedUsers[i];
                        }
                    }
                    
                    $scope.project.invitedUsers = refreshedListOfInvitedUsers;
                    
                } else {
                    // alert("you have accept this invitation this user");
                    SweetAlert.swal("Error!", "You have accepted this invitation already!", "error");
                    return;
                }

                Projects.update({
                    id: $scope.project._id
                }, $scope.project, function() {
                    $scope.hasBeenInvited = false;
                    
                    $scope.generateAcceptAlert({
                        user_id: $scope.project.user.user_id,
                        picture: $scope.project.user.picture,
                        name: $scope.project.user.name
                    });
                    
                    SweetAlert.swal("Done!", "You have accepted this the invitation!", "success");
                });

            };

            $scope.isUserSelected = function ( /* Object */user ) {
                // summary
                //      check if the user has been selected for the project
                // params
                //      user - the user to check
                // return
                //      true if the user is in the list of selected users, otherwise false
                
                var exists = false;
                for (var i = 0; i < $scope.project.selectedUsers.length; i++) {
                    if (user.user_id == $scope.project.selectedUsers[i].user_id) {
                        exists = true;
                    }
                }
                
                return exists;
            };

            $scope.accept = function(profile) {
                var user = {
                    user_id: profile.user_id,
                    name: profile.name,
                    picture: profile.picture
                };

                var exist = false;
                for (var i = 0; i < $scope.project.selectedUsers.length; i++) {
                    if (user.user_id == $scope.project.selectedUsers[i].user_id) {
                        exist = true;
                    }
                };
                if (exist == false) {
                    $scope.project.selectedUsers.push(user);
                } else {
                    // alert("this user has been accepted");
                    SweetAlert.swal("Error!", "This user has been accepted!", "error");
                    return;
                }

                $scope.project.appliedUsers = $scope.project.appliedUsers.filter(function(person) {
                    return person.user_id != user.user_id;
                });

                Projects.update({
                    id: $scope.project._id
                }, $scope.project, function() {
                    
                    $scope.generateAcceptApplicationAlert( user );
                    
                    SweetAlert.swal("Done!", "You accepted the request of " + user.name, "success");
                });

            }



            // RATING
            // $scope.rate = 0;

            $scope.rateInit = true;
            $scope.max = 5;
            // $scope.isReadonly = false;

            $scope.hoveringOver = function(value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.max);


            };

            $scope.hoveringRatingUser = function(value, selectedUserIndex) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.max);

                console.log("RATE USER", value, selectedUserIndex);

            };

            $scope.ratingStates = [{
                stateOn: 'glyphicon-ok-sign',
                stateOff: 'glyphicon-ok-circle'
            }, {
                stateOn: 'glyphicon-star',
                stateOff: 'glyphicon-star-empty'
            }, {
                stateOn: 'glyphicon-heart',
                stateOff: 'glyphicon-ban-circle'
            }, {
                stateOn: 'glyphicon-heart'
            }, {
                stateOff: 'glyphicon-off'
            }];


            $scope.returnUrl = $location.hash();

            $scope.back = function () {
                // summary
                //      return back to projects list
                //      if a hash is existing in the url, we determine that the user came from the projects list filtered by category
                //      also attacht the previous search params if any
                
                var returnUrl = $location.hash();
                $location.hash("");
                
                if ( store.get("searchParams") ) {
                    $location.path(returnUrl).search(store.get("searchParams"));
                    store.remove("searchParams");
                } else {
                    $location.path(returnUrl);
                }

            };
            
            $scope.search = function ( /* String */searchQuery ) {
                // summary
                //      this function is triggered when the user clicks on a skill or interest pill
                //      the user would then be redirected to the search results
                // params
                //      searchQuery - the clicked skill or interest
                
                $location.path("/search").search({q: searchQuery});
            };
            
            $scope.returnUrl = $location.path();
            
            $scope.editProject = function () {
                 // summary
                 //     load edit project page
                 
                 $location.path("/project/edit/" + $scope.project._id).hash($scope.returnUrl);
            };
            
            $scope.currentPath = $location.path();
            //Analytics
            Analytics.visitor({
                user_id: $scope.auth.profile._id,
                role: $scope.auth.profile.role,
                job_role: $scope.auth.profile.job_role,
                country: $scope.auth.profile.country
            }, function(ret) {
                console.log('visitor', ret);
            });

        }
    ]);