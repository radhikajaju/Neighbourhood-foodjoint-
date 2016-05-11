/*
 * description Object with different locations from the neighboourhood.
 * description Some variables are added but used latter(for now)
 */
var locations = [{
    locationName: 'Gomti Nagar Greens',
    streetName: 'Gomti Nagar Railway Station Road, Vivek Khand, Near Neelkanth Sweets, Gomtinagar',
    zipCode: ' 226010',
    city: 'Lucknow',
    description: 'Excellent dining, with unique interiors',
    Lati: 26.862585, 
    Long: 80.997039, 
    id: 'gomtigreen'
}, {
    locationName: 'JJ Bakers',
    streetName: 'Vijay Khand, Ujariyaon, Vivek Khand 4,Gomti Nagar',
    zipCode: '226010',
    city: 'Lucknow',
    description: 'Bakery with mouth watering pastries',
    Lati: 26.857871,
    Long:  80.994209,
    id: 'jjBakers'
}, {
    locationName: 'Mr. Brown',
    streetName: 'Vineet Khand, Husaria Crossing, Gomti Nagar ',
    zipCode: '226010',
    city: 'Lucknow',
    description: 'One of the finest Bakery plus cafeteria',
    Lati: 26.855165,
    Long: 81.009135, 
    id: 'mrBrown'
}, {
    locationName: 'Goli Vada Pav',
    streetName: 'Sahara Plaza, Patrakar Puram, Gomtinagar',
    zipCode: '226010',
    city: 'Lucknow',
    description: 'Vada Pav food joint, with more than 10 varities',
    Lati: 26.852959,
    Long: 80.998793,
    id: 'goliVada'
}, {
    locationName: 'Mainland China',
    streetName: 'Riverside Mall, Gomtinagar, Vipinkhand',
    zipCode: '226010',
    city: 'Lucknow',
    description: 'Famous for its Chinese quizen in Lucknow',
    Lati: 26.853404,
    Long: 80.973201, 
    id: 'mainlandChina'
}];

//this is the first model
var mapObj = {};

/**
 * @description Initialize the Google Map
 * @param {object} canvasMap - The name of the Google Map
 */
mapObj.initMap = function() {
    var self = this;
    self.canvasMap = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 26.850952, 
            lng: 80.994576 
        },
        zoom: 13
    });
    $('#map').css('height', '400px');
    mapObj.createMarkers();
    mapObj.setAllMarkers(self.canvasMap);
    mapObj.createInfoWindow();
};
/**
 * description Create the markers and its definitions
 * description Calculate each marker based on its given Lattitude and Longitude
 * description Also sets each title, description and city name, in my case Lucknow India
 */
mapObj.createMarkers = function() {
    'use strict';

    var self = this;
    self.marker = null;
    self.markerArray = ko.observableArray();

    self.displayAllMarkers = ko.computed(function() {
        //loop through the locations and create markers.
        for (var i = 0; i < locations.length; i++) {
            var LatLng = {
                lat: locations[i].Lati,
                lng: locations[i].Long
            };
            self.marker = new google.maps.Marker({ //create the markers
                position: LatLng,
                title: locations[i].locationName,
                description: locations[i].description,
                city: locations[i].city,
            });
            self.markerArray.push(self.marker); //store all markers in an array

            mapObj.openWindow(self.marker, false);
            mapObj.bounceMarker(self.marker, false);
        }

    }, self);
};

/**
 * description Takes all the markers from the MarkerArray and puts them on the map
 * @param {object} - map - Google Map from initMap()
 */
mapObj.setAllMarkers = function(map) {

    for (var i = 0; i < locations.length; i++) {
        this.markerArray()[i].setMap(map);
    }
}; //end setAllMarkers

/** Create a Google Map popup window which contains information */
mapObj.createInfoWindow = function() {
    this.infowindow = new google.maps.InfoWindow({
        content: '<div id="windowTool"></div>'
    });
};

/*
 * @description When a list item or marker is clicked (this is checked with @param status) the window will be opened
 * @param {object} marker - Map Marker object
 * @param {boolean} status - Status: Sidebar selection or map selection
 */

mapObj.openWindow = function(marker, status) { //open the GM tooltip
    var self = this;
    //click and then open the correct window for that marker
    if (status === false) {
        marker.addListener('click', function(markerO) {
            openWin();
        });
    } else {
        openWin();
    }

    /**
     * @description Close an already opened window
     * @description Open a new one base on the name of the map and the specific marker
     * @description Empty everything in the previous window
     * @description Set and show the title and the description
     * @description launch funtion displayPhoto from the photo Model
     */
    function openWin() {
        self.infowindow.close(); //close other infowindow
        self.infowindow.open(self.canvasMap, marker); //open the window
        self.infowindow.setContent('<div><h4>' + marker.title + '</h4>' + '<h5>' + marker.description + '</h5></div>');
        photoObj.displayPhoto(marker); //get the photos from the internet

    }
};

/*
 * @description Bounce the selected marker. But different models use this so a status check is being done
 * @param {object} marker - Selected Map Marker object
 * @param {boolean} status - Status: Sidebar selection or map selection
 */
mapObj.bounceMarker = function(marker, status) {

    if (status === false) {
        marker.addListener('mouseover', function(markerON) {
            //bounce the marker when mouseover the marker on the map
            bounce(marker);
        });
    } else {
        //bounce the marker when mouseover over the list items
        bounce(marker);
    }

    /*
     * @description Bounce the selected marker.
     * @param {object} marker - Selected Map Marker object
     */
    function bounce(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        //bounce the actual marker and unbounce it after a few of sec.
        window.setTimeout(function() {
            unbounce(marker);
        }, 2500);
    }
    /*
     * @description Let the bounce of the selected marker STOP
     * @param {object} marker - Selected Map Marker object
     */
    function unbounce(marker) {
        marker.setAnimation(null);
    }
};

/*
 * @description creation of the Sidebar Model
 */
var sidebarObj = {};

/*
 * @description Initialize the sidebar Model
 */
sidebarObj.init = function() {

    this.places = ko.observableArray(locations.slice(0)); //array to hold the locations
    this.query = ko.observable(''); 

};
sidebarObj.init(); 

/*
 * @description Search function to search through the locations
 * @param {object} marker - Selected Map Marker object
 * @param {boolean} status - Status: Sidebar selection or map selection
 */
sidebarObj.searchLoc = function() {
    var self = this;

    /*
     * @description Search function to search through the locations
     * @param {object} value - takes the value from the searchbar
     *
     */
    self.query.subscribe(search = function(value) {
        self.places.removeAll(); // remove all the current places
        mapObj.setAllMarkers(null); //remove markers from the map

        for (var i = 0; i < locations.length; i++) {
            //iterate through the locations to find the query value (the name of the location)
            if (locations[i].locationName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.places.push(locations[i]);

                self.marker = mapObj.markerArray()[i]; //get the marker data from the array in the mapModel
                self.marker.setMap(mapObj.canvasMap); //set the markers back on the map
            }
        }
    });
};

sidebarObj.searchLoc(); 

/*
 * @description When a location in the sidebar is highlighted with the mouse we know what marker corresponds with that name
 * @description Do the mouse over and click (when clicked) and bounce the marker and open a window
 * @param {object} element - @location object
 * @param {jQuery object} domEl - returns if mouse is hovered
 */
sidebarObj.selectLocation = function(element, domEl) { 
    console.log('element', element);
    console.log('domEl', domEl);
    var current = domEl.currentTarget;
    showMarker(element.locationName);

    //show the marker that is selected based on the location name
    function showMarker(locationName) {
        for (var i = 0; i < mapObj.markerArray().length; i++) {
            if (mapObj.markerArray()[i].title.toLowerCase().indexOf(locationName.toLowerCase()) >= 0) {
                var marker = mapObj.markerArray()[i];
                mapObj.bounceMarker(marker, true);
            }
        }
    }
};

/*
 * @description Open the Popup Window for the selected location
 * @param {object} element - @location object
 * @param {jQuery object} domEl - returns if mouse is hoveredd
 */
sidebarObj.openWin = function(element, domEl) {
    var current = domEl.currentTarget;
    for (var i = 0; i < mapObj.markerArray().length; i++) {
        if (mapObj.markerArray()[i].title.toLowerCase().indexOf(element.locationName.toLowerCase()) >= 0) {
            var marker = mapObj.markerArray()[i];
            mapObj.openWindow(marker, true);
        }
    }
};

/*
 * @description When the users clicks a marker this function (or model) is run to display photos below the map
 */
var photoObj = {
    showFlickr: ko.observable(true),
    urls_flickr: ko.observableArray(),
    noImg: ko.observable(false),
    errorImg: ko.observable(false),
};

/*
 * @description If there is a location found please go ahead and print the pictures
 * @param { object} [marker] [Google Maps Marker]
 */
photoObj.displayPhoto = function(marker) {
    var locationName = marker.title;

    if (locationName === undefined) {
        return false;
    } else { //only perform action if there is a location set

        photoObj.flickr(marker);
    }
};

/*
 * @description Retrieve images from Flickr using its API. The search is done base on the title of the marker
 * @param { object} [marker] [Google Maps Marker]
 */
photoObj.flickr = function(marker) {
    var self = this;
    var locationName = marker.title;
    self.urls_flickr([]); //empty array
    var string = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e291a839000711cc0d54015ed9636d6a&jsoncallback=?';
    
    $.getJSON(string, {
            // tag: locationName,
            text: locationName,
            tagmode: 'any',
            sort: 'interestingness-desc',
            has_geo: 1,
            per_page: 2,
            extras: 'description',
            format: 'json'
        },
        function(data) {

            if (data.stat !== 'fail') { //check for failure

                for (var i = 0; i < data.photos.photo.length; i++) {

                    //check if the locationName is in the title && in the description. If so, it's a valid photo
                    var title_check = data.photos.photo[i].title.toLowerCase().indexOf(locationName.toLowerCase());
                    var decript_check = data.photos.photo[i].description._content.indexOf(locationName.toLowerCase());

                    if (title_check || decript_check >= 0) {
                        var photosChecked = data.photos.photo[i];
                        var photoUrl = 'https://farm' + photosChecked.farm + '.staticflickr.com/' + photosChecked.server + '/' + photosChecked.id + '_' + photosChecked.secret + '.jpg' + '" >';
                        self.urls_flickr.push({
                            url: photoUrl
                        }); //push photos in an array again so that we can use them in the html
                    }
                }

                var randPic = self.urls_flickr()[Math.floor(Math.random() * self.urls_flickr().length)]; //randomizer
                console.log(randPic);
            } else {
                photoObj.errorImg(true);
                self.infowindow.setContent('<span>' + 'Error occured retrieving photos' + '</span>');
            }
        }
    );

    $(document).ajaxError(function() {
        self.infowindow.setContent('<span>' + 'Error occured retrieving photos' + '</span>');
    });

};
ko.applyBindings(mapObj, document.getElementById('map'));
ko.applyBindings(sidebarObj, document.getElementById('sidebar'));
