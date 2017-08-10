(function () {
    angular
        .module("Project")
        .controller("AdminUserController", AdminUserController);

    function AdminUserController($rootScope, UserService) {
        var vm = this;
        // UserService
        //     .findAllUsers()
        //     .then(function (users) {
        //         vm.users = users;
        //     });
        loadPage();
        
        vm.addUser = addUser;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.updateUser = updateUser;
        vm.editUser = editUser;
        vm.order = order;

        function loadPage() {
            UserService
                .findAllUsers()
                .then(function (users) {
                    vm.users = users;
                });
        }
        function addUser() {
            if (vm.username && vm.password) {
                if (vm.role === "Admin") {
                    vm.role = "Admin";
                } else {
                    vm.role = "User";
                }
                var newUser = {
                    username: vm.username,
                    password: vm.password,
                    firstName: vm.firstname,
                    lastName: vm.lastname,
                    role: vm.role
                };
                UserService.createUser(newUser)
                    .then(function (newUser) {
                        vm.username = "";
                        vm.password = "";
                        vm.firstname = "";
                        vm.lastname = "";
                        vm.role = "";

                    });
            }
            loadPage();

        }

        function updateUser() {
            var role = vm.role;
            var newUser = {
                username: vm.username,
                password: vm.password,
                firstName: vm.firstname,
                lastName: vm.lastname,
                role: vm.role
            };
            UserService.updateUser(vm.user._id, newUser)
                .then(function (response) {
                    vm.username = "";
                    vm.password = "";
                    vm.firstname = "";
                    vm.lastname = "";
                    vm.role = "";
                });
            loadPage();
        }

        function deleteUser(user) {
            if (user._id != $rootScope.user._id) {
                UserService.deleteUser(user._id)
                    .then(function (response) {
                        loadPage();
                    });
            } else {
                alert("You cannot delete yourself!");
            }
        }

        function editUser(user) {
            vm.user = user;
            vm.username = user.username;
            vm.password = user.password;
            vm.firstname = user.firstName;
            vm.lastname = user.lastName;
            vm.role = user.role;
        }

        function order(predicate) {
            vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
            vm.predicate = predicate;
        }
    }
})();