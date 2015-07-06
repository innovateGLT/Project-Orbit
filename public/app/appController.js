'use strict';

angular.module('app')

.controller('appController', ['$scope', '$location', '$anchorScroll', 'store',
    
    function ($scope, $location, $anchorScroll, store) {
    
    
        $scope.$on('$locationChangeStart', function(event) {
            // summary
            //      need to watch the url changes to determine how the main view would be rendered
            //      should we show the navigation bar or not

            //      navigation header is hidden on the home page
            //      the main container is hidden on the My Pofile page and User profile page
            
            $scope.isNavigationVisibile = $location.path() !== "/";
            $scope.isContainerVisible = $location.path() !== "/profile";
            $scope.isUserViewPage = $location.path().indexOf("/user/list") === -1 && $location.path().indexOf("/user") === 0;
            
            if ( $location.path() == "/search" ) {
                store.set("searchParams", $location.search());
            }
            
            $anchorScroll();
        });
        
    
    }
]);