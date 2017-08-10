angular
    .module('gservice', [])
    .factory('gservice', function($rootScope, $http){

        var googleMapService = {};
        var locations = [];
        var lastMarker;
        var currentSelectedMarker;
        var selectedLat = 39.50;
        var selectedLong = -98.35;
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // Refresh the Map
        googleMapService.refresh = function(latitude, longitude, filteredResults){

            locations = [];
            selectedLat = latitude;
            selectedLong = longitude;

            if (filteredResults){
                locations = convertToMapPoints(filteredResults.data);

                initialize(latitude, longitude, true);
            }
            else {
                $http.get('/locations').then(function (response){
                    locations = convertToMapPoints(response.data);

                    initialize(latitude, longitude, false);
                },function (error){

                });
            }

        };

        var convertToMapPoints = function(response){
            var locations = [];

            for(var i= 0; i < response.length; i++) {
                var location = response[i];

                var  contentString =
                    '<p><b>Username</b>: ' + location.username +
                    '<br><b>Age</b>: ' + location.age +
                    '<br><b>Gender</b>: ' + location.gender +
                    '<br><b>Favorite Language</b>: ' + location.favlang +
                    '</p>';

                locations.push({
                    latlon: new google.maps.LatLng(location.location[1], location.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    username: location.username,
                    gender: location.gender,
                    age: location.age,
                    favlang: location.favlang
                });
            }
            return locations;
        };

        var initialize = function(latitude, longitude, filter) {

            var myLatLng = {lat: parseFloat(selectedLat), lng: parseFloat(selectedLong)};

            if (!map){
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 3,
                    center: myLatLng
                });
            }

            //////////////////Here!!!!!!!!!!!!!!!!!!!!!!!!!

            if(filter){
                icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
            }
            else{
                icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
            }

            locations.forEach(function(n, i){
                var marker = new google.maps.Marker({
                    position: n.latlon,
                    map: map,
                    title: "Big Map",
                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                });


                google.maps.event.addListener(marker, 'click', function(e){
                    currentSelectedMarker = n;
                    n.message.open(map, marker);
                });
            });

            var initialLocation = new google.maps.LatLng(latitude, longitude);
            var marker = new google.maps.Marker({
                position: initialLocation,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
            lastMarker = marker;

            map.panTo(new google.maps.LatLng(latitude, longitude));

            google.maps.event.addListener(map, 'click', function(e){
                var marker = new google.maps.Marker({
                    position: e.latLng,
                    animation: google.maps.Animation.BOUNCE,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                });

                if(lastMarker){
                    lastMarker.setMap(null);
                }

                // Create a new red bouncing marker and move to it
                lastMarker = marker;
                map.panTo(marker.position);

                // Update Broadcasted
                googleMapService.clickLat = marker.getPosition().lat();
                googleMapService.clickLong = marker.getPosition().lng();
                $rootScope.$broadcast("clicked");
            });
        };

        // Refresh the page upon window load
        google.maps.event.addDomListener(window, 'load',
            googleMapService.refresh(selectedLat, selectedLong));

        return googleMapService;
    });

