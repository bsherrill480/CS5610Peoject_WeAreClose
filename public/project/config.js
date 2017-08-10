(function(){
    angular
        .module("Project")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider

            .when('/register', {
                templateUrl : "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when('/login', {
                templateUrl : "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when('/profile', {
                templateUrl : "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedIn
                }
            })
            .when('/recording', {
                templateUrl : "views/main/location.view.client.html",
                controllerAs: "model",
                controller: "addCtrl",
                resolve: {
                    loggedin: checkLoggedIn
                }
            })

            .when('/find', {
                templateUrl : "views/main/find.view.client.html",
                controllerAs: "model",
                controller: "queryCtrl",
                resolve: {
                    loggedin: checkLoggedIn
                }
            })

            .when('/manageUser', {
                templateUrl : "views/admin/admin.user.client.html",
                controllerAs: "model",
                controller: "AdminUserController",
                resolve: {
                    loggedin: checkLoggedIn
                }
            })

            .otherwise({
                redirectTo : "/login"
            });
    }

    var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http
            .get('/api/checkLoggedIn').then(function(response) {
                var user = response.data;
                console.log(user);
                $rootScope.errorMessage = null;

                if (user !== '0') {
                    $rootScope.user = user;
                    deferred.resolve(user);
                } else {
                    deferred.reject();
                    $location.url('/login');
                }
            });
        return deferred.promise;
    };
})();