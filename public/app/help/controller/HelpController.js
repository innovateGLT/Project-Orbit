'use strict';

angular.module('help')

    .controller('HelpController', ['$scope', '$location', 'SecurityService',
		
        function( $scope, $location, SecurityService ) {
            
            
            $scope.auth = SecurityService.auth();
            
            $scope.feedback = {};
            $scope.feedback.empId = $scope.auth.profile.empId;
            $scope.feedback.name = $scope.auth.profile.name;
            $scope.feedback.email = $scope.auth.profile.email;
            $scope.feedback.picture = $scope.auth.profile.picture;

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
                            label       : "Rating an Opportunity",
                            template    : "/app/help/template/content/rating-an-opportunity.html",
                            url         : "/help/faq/rating-an-opportunity",
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
            ];
            
            
            $scope.topics = [
                { id: 1, label: "Topic 1" },
                { id: 2, label: "Topic 2" },
                { id: 3, label: "Topic 3" },
                { id: 4, label: "Topic 4" },
                { id: 5, label: "Topic 5" },
                { id: 6, label: "Topic 6" },
                { id: 7, label: "Topic 7" },
                { id: 8, label: "Topic 8" },
                { id: 9, label: "Topic 9" }
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
                    $scope.breadcrumbs.push( navigationItem );
                    
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
        }
    ])

;