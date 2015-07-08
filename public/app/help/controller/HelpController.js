'use strict';

angular.module('help')

    .controller('HelpController', ['$scope', '$location',
		
        function( $scope, $location ) {

			$scope.helpPageTitle = "This is the Help Page!";

        }
    ])

;