(function() {
    angular
        .module("Project")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            UserService
                .login(username, password)
                .then(
                    function (user) {
                        if (user) {
                            $location.url("/profile");
                        }
                    },
                    function (error) {
                        vm.message = "Username does not exist.";
                    });
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, password, vpassword) {
            if (username === undefined || username === null || username === "" || password === undefined || password === ""
            ||vpassword === undefined || vpassword ==="") {
                vm.message = "Username and Passwords cannot be empty.";
                return;
            }
            if (password !== vpassword) {
                vm.message = "Password does not match.";
                return;
            }
            UserService
                .findUserByUsername(username)
                .then(function (user) {
                    if (user) {
                        vm.message = "Username already exists.";
                    }
                    else {
                        var NewUser = {
                            username: username,
                            password: password,
                            firstName: "",
                            lastName: "",
                            email: ""
                        }

                        UserService
                            .register(NewUser)
                            .then(function (newuser) {
                                if (newuser) {
                                    $location.url("/profile");
                                }
                            });
                    }
                });
        }
    }

    function ProfileController(loggedin, $timeout, UserService, $location) {
        var vm = this;
        vm.uid = loggedin._id;
        vm.user = loggedin;

        function init() {
            renderUser(vm.user);
        }

        init();

        function renderUser (user) {
            vm.user = user;
        }

        vm.updateUser = updateUser;
        vm.removeUser = removeUser;
        vm.logout = logout;

        function updateUser(user) {
            UserService
                .updateUser(vm.user._id, user)
                .then(
                    function (newUser) {
                        if (newUser) {
                            vm.message = "Profile changes saved!";
                        }
                    });

            $timeout(function () {
                vm.message = null;
            }, 3000);
        }

        function removeUser(user) {
            UserService
                .deleteUser(user._id)
                .then(function () {
                    $location.url("/login");
                });

        }

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/login');
                });
        }
    }

})();