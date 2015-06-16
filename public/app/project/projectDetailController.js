'use strict';

angular.module('project')
    .controller('ProjectDetailCtrl', ['$scope', '$routeParams', 'Projects', '$location', 'Questions', 'Credentials', 'Users', 'SweetAlert', 'Email', 'Rating', 'store',
        function($scope, $routeParams, Projects, $location, Questions, Credentials, Users, SweetAlert, Email, Rating, store) {

            $scope.auth = Credentials.auth();

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
            }


            $scope.project = Projects.get({
                id: $routeParams.id
            }, function() {
                if ($scope.auth.profile.user_id == $scope.project.user.user_id) {
                    $scope.isOwner = true;
                } else {
                    $scope.isOwner = false;
                }



                if ($scope.auth.profile.email == ADMIN_EMAIL) {
                    $scope.isOwner = true;
                    $scope.isAdmin = true;
                }


                $scope.matchedUsers = Users.getMatches({
                    skills: $scope.project.skillset.join(',')
                }, function() {
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

                            // console.log("OOOOOOOOOOOOOO",rate,a,b);

                            SweetAlert.swal("Done!", "You have rated the the user " + rate + " stars.", "success");

                            // $scope.project.selectedUsers[i].isReadonly = true;
                            // $scope.project.selectedUsers[i].rate = rate;

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
                        var userId = $scope.project.appliedUsers[i].user_id;
                        $scope.matchedUsers = $scope.matchedUsers.filter(function(person) {
                            return person.user_id != userId;
                        });
                    };

                    // remove all matched users who have been selected
                    for (var i = 0; i < $scope.project.selectedUsers.length; i++) {
                        var userId = $scope.project.selectedUsers[i].user_id;
                        $scope.matchedUsers = $scope.matchedUsers.filter(function(person) {
                            return person.user_id != userId;
                        });
                    };

                    // remove all matched users who have been invited
                    for (var i = 0; i < $scope.project.invitedUsers.length; i++) {
                        var userId = $scope.project.invitedUsers[i].user_id;
                        $scope.matchedUsers = $scope.matchedUsers.filter(function(person) {
                            return person.user_id != userId;
                        });
                    };



                    console.log("MATCHED USERS", $scope.matchedUsers);

                });


                $scope.hasApplied = false;
                for (var i = 0; i < $scope.project.appliedUsers.length; i++) {
                    if ($scope.auth.profile.user_id == $scope.project.appliedUsers[i].user_id) {
                        $scope.hasApplied = true;
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
                                })

                                $scope.isReadonly = true;
                                $scope.isRated = true;

                                SweetAlert.swal("Done!", "You have rated the the owner of the project: " + rate + " stars. \n You cannot rate any more", "success");
                                $scope.isReadonly = true;
                            })
                        }
                    })
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
                }, function() {
                    Projects.remove({
                        id: $scope.project._id
                    }, function() {
                        SweetAlert.swal({
                            title: "Removed!",
                            text: "The project has been removed! You will go to the homepage",
                            type: "success",
                            showCancelButton: true,
                            confirmButtonText: "Go",
                            closeOnConfirm: false
                        }, function() {
                            window.location = "/";
                        });

                    });

                });


            };

            $scope.ask = function() {
                $scope.showAsk = true;
            };


            $scope.submitQuestion = function() {


                var newQuestion = {
                    content: $scope.question,
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
                    SweetAlert.swal("Done!", "Your text has been submit!", "success");
                });
                console.log($scope.question);
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





                    Users.getByUserId({
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
                                swal.showInputError("You need to write something before sending your application!");
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
                }

                var exist = false;
                for (var i = 0; i < $scope.project.invitedUsers.length; i++) {
                    if (invitedUser.user_id == $scope.project.invitedUsers[i].user_id) {
                        exist = true;
                    }
                };
                if (exist == false) {
                    //
                } else {
                    // alert("you have invited this user");
                    SweetAlert.swal("Error!", "You have invited this user", "error");
                    return;
                }

                Users.getByUserId({
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
                            swal.showInputError("You need to write something before sending an inviation!");
                            return false
                        }

                        if (exist == false) {
                            $scope.project.invitedUsers.push(invitedUser);
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
                            // SweetAlert.swal("Done!", "You applied to the project! An email has been sent to the admin", "success");
                            // SweetAlert.swal("Nice!", "An invitation has been sent to the user", "success"); 
                        });
                        Projects.update({
                            id: $scope.project._id
                        }, $scope.project, function() {

                            // console.log("PROJECT h")
                        });

                        SweetAlert.swal("Nice!", "The user has been invited", "success");

                    });

                });





            }

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


            $scope.acceptInvitation = function(profile) {
                var user = {
                    user_id: profile.user_id,
                    name: profile.name
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
                    // alert("you have accept this invitation this user");
                    SweetAlert.swal("Error!", "You have accepted this invitation already!", "error");
                    return;
                }

                Projects.update({
                    id: $scope.project._id
                }, $scope.project, function() {
                    $scope.hasBeenInvited = false;
                    SweetAlert.swal("Done!", "You have accepted this the invitation!", "success");
                });

            }

            $scope.accept = function(profile) {
                var user = {
                    user_id: profile.user_id,
                    name: profile.name
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



        }
    ]);