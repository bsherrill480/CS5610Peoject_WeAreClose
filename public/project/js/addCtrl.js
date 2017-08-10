var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl
    .controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates to the center of the US
    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    //This is the method to get the real location
    geolocation.getLocation().then(function(data){
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

        $scope.formData.htmlverified = "Real Data!";

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    });

    //This is the method to get fake location
    $rootScope.$on("clicked", function(){

        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            $scope.formData.htmlverified = "Fack Data :(";
        });
    });

    $scope.createLocation = function() {
        var locationData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            age: $scope.formData.age,
            favlang: $scope.formData.favlang,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };

    $http.post('/locations', locationData).then(function (success) {
            $scope.formData.username = "";
            $scope.formData.gender = "";
            $scope.formData.age = "";
            $scope.formData.favlang = "";

            gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
        },function (error){
            console.log('Error: ' + error);
        });
    };
});