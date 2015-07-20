'use strict';

angular.module('help')

    .controller('HelpController', ['$scope', '$location', 'SecurityService', 'ContactUsService', 'FeedbackService', 'SweetAlert',
		
        function( $scope, $location, SecurityService, ContactUsService, FeedbackService, SweetAlert ) {
            
            
            $scope.auth = SecurityService.auth();
            
            $scope.user = $scope.auth.profile;
            
            $scope.$watch('auth.profile', function() {
                if (($scope.auth.profile) && ($scope.auth.profile.email === ADMIN_EMAIL)) {
                    $scope.isAdmin = true;
                }
            });

            $scope.loadNextFeedbacks = function () {
                
                if ( !$scope.listFetchDisabled && !$scope.busy ) {
                    
                    // set busy to true to disable next calls to avoid multiple async calls
                    $scope.busy = true;
                
                    FeedbackService.query({
                        pageNo: $scope.pageNo,
                        recordsPerPage: $scope.recordsPerPage
                    }, function ( feedbacks ) {
                        
                        feedbacks.forEach(function ( feedback ) {
                            $scope.feedbacks.push( feedback );
                        });
                        
                        // if the end is already reached, we disable the auto scroll mechanism
                        if ( feedbacks.length < $scope.recordsPerPage ) {
                            $scope.listFetchDisabled = true;
                        }
                        
                        // increment pageNo to load next page
                        $scope.pageNo++;
                        
                        $scope.busy = false;
                    });
                }
            };

            $scope.loadNextComments = function () {
                
                if ( !$scope.listCommentsFetchDisabled && !$scope.commentsBusy ) {
                    
                    // set commentsBusy to true to disable next calls to avoid multiple async calls
                    $scope.commentsBusy = true;
                
                    ContactUsService.query({
                        pageNo: $scope.pageNo,
                        recordsPerPage: $scope.recordsPerPage
                    }, function ( messages ) {
                        
                        messages.forEach(function ( message ) {
                            $scope.messages.push( message );
                        });
                        
                        // if the end is already reached, we disable the auto scroll mechanism
                        if ( messages.length < $scope.recordsPerPage ) {
                            $scope.listCommentsFetchDisabled = true;
                        }
                        
                        // increment pageNo to load next page
                        $scope.pageNo++;
                        
                        $scope.commentsBusy = false;
                    });
                }
            };
            
            
            $scope.busy = false;
            $scope.commentsBusy = false;
            
            // initial page to load
            $scope.pageNo         = 1;
            $scope.recordsPerPage = 5;
            
            // initialize messages list
            $scope.feedbacks = [];
            $scope.messages = [];
            
            $scope.listFetchDisabled = false;
            $scope.listCommentsFetchDisabled = false;
            
            $scope.loadNextFeedbacks();
            $scope.loadNextComments();

            // Build the left side navigation items
            $scope.navigationItemsStructure = [
                // HOW IT STARTED
                {
                    label       : "How It Started",
                    template    : "/app/help/template/content/how-it-started.html",
                    url         : "/help/how-it-started",
                    index       : 0
                },
                
                // HOW IT WORKS
                {
                    label       : "How It Works",
                    template    : "/app/help/template/content/how-it-works.html",
                    url         : "/help/how-it-works",
                    index       : 0,
                    items : [
                        {
                            label       : "Opportunity Owners",
                            template    : "/app/help/template/content/how-it-works-owner.html",
                            url         : "/help/how-it-works/owner",
                            index       : 1
                        },
                        {
                            label       : "Opportunity Seekers",
                            template    : "/app/help/template/content/how-it-works-seeker.html",
                            url         : "/help/how-it-works/seeker",
                            index       : 1
                        },
                        {
                            label       : "Benefits",
                            template    : "/app/help/template/content/benefits.html",
                            url         : "/help/how-it-works/benefits",
                            index       : 1
                        },
                        {
                            label       : "Accessibility",
                            template    : "/app/help/template/content/accessibility.html",
                            url         : "/help/how-it-works/accessibility",
                            index       : 1
                        }
                    ]
                },
                
                // YOUR PROFILE
                {
                    label       : "Your Profile",
                    template    : "/app/help/template/content/your-profile.html",
                    url         : "/help/your-profile",
                    index       : 0,
                    items : [
                        {
                            label       : "Basics",
                            template    : "/app/help/template/content/basics.html",
                            url         : "/help/your-profile/basics",
                            index       : 1
                        },
                        {
                            label       : "Manage Your Profile",
                            template    : "/app/help/template/content/manage-your-profile.html",
                            url         : "/help/your-profile/manage",
                            index       : 1
                        }
                    ]
                },
                
                // FAQ
                {
                    label       : "FAQ",
                    url         : "/help/faq",
                    index       : 0,
                    items : [
                        {
                            label       : "Posting an Opportunity",
                            template    : "/app/help/template/content/posting-an-opportunity.html",
                            url         : "/help/faq/posting-an-opportunity",
                            index       : 1
                        },
                        {
                            label       : "Managing an Opportunity",
                            template    : "/app/help/template/content/managing-an-opportunity.html",
                            url         : "/help/faq/managing-an-opportunity",
                            index       : 1
                        },
                        {
                            label       : "Applying for an Opportunity",
                            template    : "/app/help/template/content/applying-for-an-opportunity.html",
                            url         : "/help/faq/applying-an-opportunity",
                            index       : 1
                        },
                        {
                            label       : "Rating a User",
                            template    : "/app/help/template/content/rating-a-user.html",
                            url         : "/help/faq/rating-a-user",
                            index       : 1
                        }
                    ]
                },
                
                // Contact Us
                {
                    label       : "Contact Us",
                    template    : "/app/help/template/content/contact-us.html",
                    url         : "/help/contact-us",
                    index       : 0
                },
                
                // FAQ
                {
                    label       : "We Love Feedback!",
                    template    : "/app/help/template/content/feedback.html",
                    url         : "/help/feedback",
                    index       : 0
                },
                
                // ContactUs Messages
                {
                    label       : "Messages",
                    template    : "/app/help/template/content/messages.html",
                    url         : "/help/messages",
                    index       : 0
                },
                
                // Feedbacks
                {
                    label       : "Feedbacks",
                    template    : "/app/help/template/content/feedbacks.html",
                    url         : "/help/feedbacks",
                    index       : 0
                }
            ];

            $scope.faqNav = $scope.navigationItemsStructure[3];
            
            $scope.resetSubtopics = function () {
                $scope.feedback.subtopic = "";
            };
            
            $scope.topics = [
                { 
                    id: 1,
                    label: "Content",
                    subtopics: [
                        "Help Content", "Opportunity Category / Types", "Project Details", "Project Selections"
                    ] 
                },
                { 
                    id: 2, 
                    label: "Delete",
                    subtopics: [
                        "Delete My Opportunity", "Delete My Profile"
                    ] 
                },
                { 
                    id: 3, 
                    label: "Functionality",
                    subtopics: [
                        "API's", "Add Integration to Other System", "Email", "Featured Opportunities", "Featured People", "Notifications", "Ratings", "Smart Match (People)", "Smart Match (Projects)", "System Messsages"
                    ] 
                },
                { 
                    id: 4, 
                    label: "Performance",
                    subtopics: [
                        "Connectivity", "Search", "Slow"
                    ] 
                },
                { 
                    id: 5, 
                    label: "Profile",
                    subtopics: [
                        "My Profile", "My Skills", "Other Person's Profile", "Other Person's Skills"
                    ] 
                },
                { 
                    id: 6, 
                    label: "UI / UX",
                    subtopics: [
                        "Branding", "Design", "Navigation", "User Experience", "User Interface"
                    ] 
                },
                { 
                    id: 7, 
                    label: "Other",
                    subtopics: [
                        "Other"
                    ] 
                }
            ];
            
            // copy the list of navigation items to preserve the original structure
            $scope.navigationItems = angular.copy($scope.navigationItemsStructure);
            
            // initial list of breadcrumb
            $scope.breadcrumbs = [ // HELP CENTER
                {
                    label       : "Help Center",
                    template    : "/app/help/template/content/help-center.html",
                    url         : "/help",
                    index       : 0
                }
            ];
            
            $scope.tempNav = [];
            
            $scope.navigate = function ( /* Object */navigationItem ) {
                // summary
                //      this function would handle the sidebar and breadcumb content update
                //      this would also load the proper content
                // params
                //      navigationItem - the clicked navigation item
                // tags
                //      private
                
                // if the menu item has child items
                if ( navigationItem.items ) {
                    
                    // toggle Back link
                    $scope.isBackVisible = true;
                    
                    $scope.tempNav.push(angular.copy($scope.navigationItems));
                    
                    // update the sidebar items
                    $scope.navigationItems = navigationItem.items;
                    
                    // update breadcrumbs
                    if ( $scope.breadcrumbs.indexOf(navigationItem) === -1 ) {
                        $scope.breadcrumbs.push( navigationItem );
                    }
                    
                // if the menu item doesn't have child items, update help content
                } else {
                    
                    // update the content with the selected help item
                    $scope.helpUrl = navigationItem.template;
                    
                    // update the windows path, so handle page refresh later on
                    $location.path( navigationItem.url );
                    
                }
            };
            
            $scope.navigateBack = function () {
                // summary
                //      this function would move the breadcrumb and sidebar one menu back, without updating the help content
                // tags
                //      private
                
                // remove the last breadcrumb
                $scope.breadcrumbs.pop();
                
                // update the navigation items
                $scope.navigationItems = $scope.tempNav.pop();
                
                if ( !$scope.navigationItems || $scope.navigationItems.length == 0 ) {
                    $scope.navigationItems = angular.copy($scope.navigationItemsStructure);
                }
                
                // toggle Back link
                $scope.isBackVisible = false;
            };
            
            
            $scope.currentNavItem = null;
            $scope.continueLoop = true;
            $scope.navParents = [];
            $scope.getNavigationItem = function ( /* Array */navigationItems ) {
                // summary
                //      this function would retrieve the navigation item from the list based from the current path
                // params
                //      navigationItems - the list of navigation items to check
                // return
                //      the navigation item that matches the current path

                navigationItems.forEach(function ( navigationItem ) {
                    
                    if ( $scope.continueLoop ) {
                    
                        // if the nav item has child items, loop recursively
                        if ( navigationItem.items ) {
                            
                            $scope.currentNavItem = $scope.getNavigationItem( navigationItem.items );

                            if ( $scope.currentNavItem ) {
                                $scope.navParents.push( navigationItem );
                                
                                $scope.navigationItems = navigationItem.items;
                            }
                            
                        // else, check if it has the same url with the current location
                        } else {
                            
                            if ( $location.path() == navigationItem.url ) {
                                
                                $scope.currentNavItem = navigationItem;
                                $scope.continueLoop = false;
                            }
                        }
                    }
                    
                });
                
                return $scope.currentNavItem;
            };
            
            // initial page content to load
            $scope.helpUrl = $scope.getNavigationItem( $scope.navigationItems ) && $scope.getNavigationItem( $scope.navigationItems ).template || "/app/help/template/content/help-center.html";
            
            $scope.breadcrumbs = $scope.breadcrumbs.concat( $scope.navParents );
            
            // toggle Back link
            $scope.isBackVisible = $scope.currentNavItem && $scope.navParents.length > 0;
            
            $scope.questions = [];
            $scope.toggleQuestion = function ( /* String */questionKey ) {
                
                $scope.questions[ questionKey ] = $scope.questions[ questionKey ] ? false : true;
                
            };
            
            $scope.contactUs = {};
            
            $scope.sendComment = function () {
                // summary
                //      this function would send an ajax request to save contact us form
                // tags
                //      private
                
                if ( $scope.contactUs.message ) {
                    var contactUs = new ContactUsService({
                        user: {
                            user_id : $scope.user.user_id,
                            name: $scope.user.name,
                            email: $scope.user.email,
                            picture: $scope.user.picture
                        },
                        message: $scope.contactUs.message
                    });
                    
                    contactUs.$save()
                        .then(function () {
                            console.log("We've received your message!");
                            SweetAlert.swal({
                                title: "Sent!",
                                type: "success",
                                text: "We've received your message! We'll get in touch soon!"
                            }, function () {
                                $scope.contactUs = {};
                            });
                        });
                }
            };
            
            $scope.feedback = {};
            
            $scope.submitFeedback = function () {
                // summary
                //      this function would send an ajax request to save feedback form
                // tags
                //      private
                
                if ( $scope.feedback.message && $scope.feedback.topic && $scope.feedback.subtopic ) {
                    var feedback = new FeedbackService({
                        user: {
                            user_id : $scope.user.user_id,
                            name: $scope.user.name,
                            email: $scope.user.email,
                            picture: $scope.user.picture
                        },
                        message: $scope.feedback.message,
                        topic: $scope.feedback.topic.label,
                        subtopic: $scope.feedback.subtopic
                    });
                    
                    feedback.$save()
                        .then(function () {
                            console.log("Feedback submitted!");
                            SweetAlert.swal({
                                title: "Thank you!",
                                type: "success",
                                text: "We have received your feedback and we'll get back to you soon, if need be."
                            }, function () {
                                $scope.feedback = {};
                            });
                        });
                }
            };
            
            $scope.returnUrl = $location.path();
            
            $scope.viewUser = function ( /* Object */user ) {
                // summary
                //      view user profile
                
                $location.path("/user/" + user.user_id).hash($scope.returnUrl);
            };
        }
    ])

;