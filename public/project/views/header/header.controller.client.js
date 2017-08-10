"use strict";
(function () {
    angular
        .module("Project")
        .controller("HeaderController", HeaderController);

    function HeaderController($rootScope, $scope, UserService) {
        $scope.loggedIn = loggedIn;
        $scope.username = username;
        $scope.isAdmin = isAdmin;
        $scope.logout = logout;

        function loggedIn() {
            return $rootScope.user != null;
        }

        function username() {
            if ($rootScope.user) {
                return $rootScope.user.username;
            }
        }

        function logout() {
            UserService.logout()
                .then(
                    function(response) {
                        $rootScope.user = null;
                    },
                    function(err) {

                    }
                )
        }

        function isAdmin() {
            if (!loggedIn()) {
                return false;
            }
            if ($rootScope.user.role == "Admin") {
                        return true;
            }
            return false;
        }
    }
})();