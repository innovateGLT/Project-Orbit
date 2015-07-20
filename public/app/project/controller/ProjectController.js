'use strict';

angular.module('project')
    .controller('ProjectController', ['$scope', 'Projects', '$location', '$routeParams', 'SecurityService', 'SweetAlert', 'AlertService', 'store',

        function($scope, Projects, $location, $routeParams, SecurityService, SweetAlert, AlertService, store) {

            $scope.auth = SecurityService.auth();

            if (!$scope.auth.isAuthenticated) {
                SecurityService.login();
                return;
            }

            console.log($scope.auth.profile);

            $scope.editing = [];

            $scope.project = {
                country: $scope.auth.profile.country
            };
            

            $scope.defaultCategories = [
                { id : "CrossUnitProjects", name : "Cross Unit Projects" },
                { id : "JobRotations", name : "Job Rotations" },
                { id : "StretchAssignments", name : "Stretch Assignments" },
                { id : "JobShadowing", name : "Job Shadowing" },
                { id : "BusinessInteractions", name : "Business Interactions" },
                { id : "AdventureAssignments", name : "Adventure Assignments" },
                { id : "OtherOpportunities", name : "Other Opportunities" },
            ];
            $scope.project.category = $scope.defaultCategories[3];

            $scope.defaultSkillCategories = ['Technical', 'Soft Skills', 'Project Management'];
            $scope.project.skillCategory = 'Technical';

            $scope.defaultEffortRequired = ['Hour(s)', 'Day(s)'];
            $scope.project.effortRequired = 'Day(s)';
            $scope.effortNum = '1';

            $scope.defaultTimeAvailability = ['Day', 'Week', 'Month'];
            $scope.project.timeAvailability = 'Day';

            $scope.defaultStatuses = ['Open', 'In Progress', 'Completed', 'Closed'];

            $scope.project.chargeable = false;
            $scope.project.visibility = "Local";

            $scope.isNewProject = true;


            $scope.DATE_FORMAT = 'DD-MM-YYYY';

            $scope.checkCategory = function ( /* String */catId ) {
                
                var category = null;
                
                angular.forEach($scope.defaultCategories, function (value, key) {
                    if ( !category && value.id === catId ) {
                        category = value;
                    } 
                });
                
                return category;
            };

            $scope.open = function( $event, calendarIndex ) {
                $event.preventDefault();
                $event.stopPropagation();
        
                switch(calendarIndex) {
                    
                    case 0 : 
                        $scope.postedEndDateCalendar.show();
                        break;
                    case 1 : 
                        $scope.startDateCalendar.show();
                        break;
                    case 2 : 
                        $scope.endDateCalendar.show();
                        break;
                    default:
                        break;
                }
            };

            if ( $routeParams.id ) {
                var project = Projects.get({
                    id: $routeParams.id
                }, function() {

                    if ($scope.auth.profile.user_id === project.user.user_id) {
                        $scope.isOwner = true;
                    } else {
                        $scope.isOwner = false;
                    }

                    if ($scope.auth.profile.email === ADMIN_EMAIL) {
                        $scope.isOwner = true;
                    }

                    if ($scope.isOwner === false) {
                        alert('You do not have authorization to edit this project');
                        // swal('Unauthorized Access!','You do not have authorization to edit this project','error');
                        window.location = '/';
                    }

                    project.postedEndDate = moment(new Date(project.postedEndDate)).format($scope.DATE_FORMAT);
                    project.startDate = moment(new Date(project.startDate)).format($scope.DATE_FORMAT);
                    project.endDate = moment(new Date(project.endDate)).format($scope.DATE_FORMAT);

                    if (!project.visibility) {
                        project.visibility = 'Global';
                    }

                    var effort = project.effortRequired.split(' ');
                    project.effortRequired = effort[1];
                    $scope.effortNum = effort[0];

                    var timeAvail = project.timeAvailability.split(' per ');
                    $scope.hoursAvail = timeAvail[0].replace("hours", '').trim();
                    project.timeAvailability = timeAvail[1].trim();

                    console.log('EDITTED PROJECT', project, timeAvail[1]);
                    console.log("EDIT", timeAvail[1].trim(), 'XXXX');

                    project.category = $scope.checkCategory(project.category);

                    $scope.project = project;
                    $scope.isNewProject = false;
                });


            }


            $scope.update = function(index) {
                var project = $scope.projects[index];
                Projects.update({
                    id: project._id
                }, project);
                $scope.editing[index] = false;
            };

            $scope.edit = function(index) {
                $scope.editing[index] = angular.copy($scope.projects[index]);
            };

            $scope.cancel = function(index) {
                $scope.projects[index] = angular.copy($scope.editing[index]);
                $scope.editing[index] = false;
            };

            $scope.remove = function(index) {
                var project = $scope.projects[index];
                Projects.remove({
                    id: project._id
                }, function() {
                    $scope.projects.splice(index, 1);
                });
            };

            $scope.save = function() {
                var newProject = angular.copy($scope.project);

                if (newProject.skillset.constructor !== Array) {

                    var skills = newProject.skillset.split(',');
                    // trim
                    for (var i = 0; i < skills.length; i++) {
                        skills[i] = skills[i].trim();
                    };
                    newProject.skillset = skills;
                }

                // check if the field is a number
                if ($scope.effortNum.match(/^[0-9]+$/) === null) {
                    swal('Error!', 'The field should be a number', 'error');
                    return;

                }

                newProject.effortRequired = $scope.effortNum + ' ' + newProject.effortRequired;
                newProject.timeAvailability = $scope.hoursAvail + " hours per " + newProject.timeAvailability;

                newProject.category = $scope.project.category.id; 


                console.log("NEW PROJECT", newProject);

                var now = new Date();
                now.setHours(0, 0, 0, 0);


                console.log('newProject.postedEndDate', newProject.postedEndDate);

                newProject.postedEndDate = moment(newProject.postedEndDate, $scope.DATE_FORMAT).toDate();
                newProject.startDate = moment(newProject.startDate, $scope.DATE_FORMAT).toDate();
                newProject.endDate = moment(newProject.endDate, $scope.DATE_FORMAT).toDate();

                // return;


                // only check if it is new project
                if ($scope.isNewProject === true) {
                    if (newProject.postedEndDate.getTime() < now.getTime()) {
                        swal('Invalid Date!', 'Project Posted End Date has to be greater than today', 'error');
                        return;
                    }

                    if (newProject.startDate.getTime() < newProject.postedEndDate.getTime()) {
                        swal('Invalid Date!', 'Start Date has to be after Project Posted End Date', 'error');
                        return;
                    }

                    if (newProject.endDate.getTime() < newProject.startDate.getTime()) {
                        swal('Invalid Date!', 'End Date has to be after Start Date', 'error');
                        return;
                    }
                } else {

                    // if we are editing project
                    if (newProject.startDate.getTime() < newProject.postedEndDate.getTime()) {
                        swal('Invalid Date!', 'Start Date has to be after Project Posted End Date', 'error');
                        return;
                    }

                    if (newProject.endDate.getTime() < newProject.startDate.getTime()) {
                        swal('Invalid Date!', 'End Date has to be after Start Date', 'error');
                        return;
                    }
                }

                console.log(newProject);

                newProject.user = {
                    user_id: $scope.auth.profile.user_id,
                    name: $scope.auth.profile.name,
                    picture: $scope.auth.profile.picture
                };

                var deferred = null;
                var message = "";
                var project = new Projects(newProject);
                if ($scope.isNewProject === true) {

                    newProject.status = 'Open';
                    deferred = project.$save();
                    message = "saved!";
                } else {
                    deferred = Projects.update({
                        id: project._id
                    }, project).$promise;
                    message = "updated!";
                }
                
                deferred.then(function () {
                    
                    SweetAlert.swal({
                        title: "Project " + message,
                        type: "success"
                    }, function(){ 
                        console.log('Project has been ' + message, project);
                        $location.url('/project/' + project._id + "#" + $location.hash());
                        
                        $scope.generateProjectUpdateAlert();
                    });
                });
            };

            // the project owner and the selected people will get this alert
            $scope.generateProjectUpdateAlert = function ( /* Object */user ) {
                var projectUpdateAlert = {
                    by_user : {
                        user_id : $scope.auth.profile.user_id,
                        name: $scope.auth.profile.name,
                        picture: $scope.auth.profile.picture
                    },
                    
                    alert_type: "project-update",
                    
                    project_name: $scope.project.title,
                    
                    project_id: $scope.project._id
                };
                
                AlertService.comment(projectUpdateAlert, function ( response ) {
                    console.log("Apply alert generated : " + response);
                });
            };

            $scope.returnUrl = $location.hash();

            $scope.backToList = function () {
                // summary
                //      return back to previous page
                //      if a hash is existing in the url, we determine that the user came from the projects list filtered by category
                //      also attacht the previous search params if any
                
                var returnUrl = $location.hash();
                $location.hash("");
                
                $location.path(returnUrl).search(store.get("searchParams"));
                store.remove("searchParams");

            };

            $scope.cancel = function () {
                // summary
                //      cancel project editing and return to project details page

                if ( $scope.returnUrl ) {
                    $location.path( $scope.returnUrl );
                    $location.hash("");
                } else {
                    
                    if ( !$scope.project_id ) {
                        $location.path("/");
                    } else {
                        $location.path("/project/" + $scope.project._id);
                    }
                }
            };
        }
    ])
;