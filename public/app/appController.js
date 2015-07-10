'use strict';

angular.module('app')

.controller('appController', ['$scope', '$location', '$anchorScroll', 'store', '$timeout', 'SecurityService',
    
    function ($scope, $location, $anchorScroll, store, $timeout, SecurityService) {
    
    
        $scope.auth = SecurityService.auth();
    
        $scope.$on('$locationChangeStart', function(event) {
            // summary
            //      need to watch the url changes to determine how the main view would be rendered
            //      should we show the navigation bar or not

            //      navigation header is hidden on the home page
            //      the main container is hidden on the My Pofile page and User profile page
            
            $scope.isNavigationVisibile = $location.path() !== "/";
            $scope.isContainerVisible = $location.path() !== "/profile" && $location.path() !== "/profile/edit";
            $scope.isUserViewPage = $location.path().indexOf("/user/list") === -1 && $location.path().indexOf("/user") === 0;
            
            if ( $location.path() == "/search" ) {
                store.set("searchParams", $location.search());
            }
            
            // TODO : REIMPLEMENT THIS AFTER BACK BEHAVIOUR HAS BEEN MOVED TO SESSION STORAGE
            //$location.hash('navigationBar');
            
            $anchorScroll();
            //$location.hash('');
        });
        
        // if the user is authenticated already and refreshes the browser, delay should only be 1s coz we already have all employee info
        // else, we expect a longer delay in retrieving the employee info from the external API
        $scope.overlayTimeout = $scope.auth.isAuthenticated ? 1000 : 4000;
        
        $scope.isLoadingVisible = true;
        while ( $scope.isLoadingVisible ) {
            
            if ( true ) {
                
                $timeout(hideLoadingOverlay, $scope.overlayTimeout);
                
                break;
            }
            
        };
        
        function hideLoadingOverlay() {
            $scope.isLoadingVisible = false;
        };
        
    }
]);