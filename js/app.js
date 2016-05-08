/*
 * description Object with different locations from the neighboourhood.
 * description Some variables are added but not used (for now)
 */
var locations = [{
    locationName: 'Cappuccino Mini Blast',
    streetName: 'Eldeco Greens, Near Fun Republic Mall',
    zipCode: '226001',
    city: 'Lucknow',
    description: 'Excellent Cafe, with unique interiors',
    Lati: 26.835361,
    Long: 80.947542, 
    id: 'cappuccino'
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
        zoom: 12
    });
    $('#map').css('height', '400px'); //overrides Bootstrap settings
    mapObj.createMarkers();
    mapObj.setAllMarkers(self.canvasMap);
    mapObj.createInfoWindow();
};
/*Create the markers and its definitions, Calculate each marker based on its given Lattitude and Longitude*/
mapObj.createMarkers = function() {
    'use strict';
    var self = this;
    self.marker = null;
    self.markerArray = ko.observableArray();
    self.displayAllMarkers = ko.computed(function() {
        //loop through the locations and create markers
        for (var i = 0; i < locations.length; i++) {
            var LatLng = {
                lat: locations[i].Lati,
                lng: locations[i].Long
            };
            self.marker = new google.maps.Marker({ 
            //create the markers
                position: LatLng,
                title: locations[i].locationName,
                description: locations[i].description,
                city: locations[i].city,
            });
            self.markerArray.push(self.marker); //push markers in an array

            mapObj.openWindow(self.marker, false);
            mapObj.bounceMarker(self.marker, false);
        } //end for

    }, self); //end displayAllMarkers
};

//description Takes all the markers from the MarkerArray and puts them onto the map
 mapObj.setAllMarkers = function(map) {
    for (var i = 0; i < locations.length; i++) {
        this.markerArray()[i].setMap(map);
    }
}; //end setAllMarkers

//Create a Google Map info (popup) window
mapObj.createInfoWindow = function() {
    this.infowindow = new google.maps.InfoWindow({
        content: '<div id="windowTool"></div>'
    });
};

/**
 * @description When a list item or marker is clicked (this is checked with @param status) the window will be opened
 * @param {object} marker - Map Marker object
 * @param {boolean} status - Status: Sidebar selection or map selection
 */

mapObj.openWindow = function(marker, status) { //open the GM tooltip
    var self = this;
    //listen to a click and then open the correct window for that marker
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
//window.infoWindow.setContent($('#placeTmpl').html());

    function openWin() {
        self.infowindow.close(); //close other infowindows first
        self.infowindow.open(self.canvasMap, marker); //open the window
        //$('#windowTool').empty(); //empty everything first
        //$('window.infoWindow.setContent($(.marker_title).html())' + marker.title + '</h4>' +
          //  '<h5>' + marker.description + '</h5></div>').appendTo('#windowTool'); //now add data

        self.infowindow.setContent( '<h4>' + marker.title + '</h4>' + '<h5>' + marker.description + '</h5></div>');
        }
};

/**
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
    /**
     * @description Bounce the selected marker.
     * @param {object} marker - Selected Map Marker object
     */
    function bounce(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        //bounce the actual marker and unbounce it after a couple of sec.
        window.setTimeout(function() {
            unbounce(marker);
        }, 2500);
    }
    /**
     * @description Let the bounce of the selected marker STOP
     * @param {object} marker - Selected Map Marker object
     */
    function unbounce(marker) {
        marker.setAnimation(null);
    }
};

//@description creation of the Sidebar Model

var sidebarObj = {};
//@description Initialize the sidebar Model
 sidebarObj.init = function() {
    this.places = ko.observableArray(locations.slice(0)); //array to hold the locations
    this.query = ko.observable(''); //oberve the search field
};
sidebarObj.init(); //launch it

/**
 * @description Search function to search through the locations
 * @param {object} marker - Selected Map Marker object
 * @param {boolean} status - Status: Sidebar selection or map selection
 */
//
sidebarObj.searchLoc = function() {
    var self = this;
    /**
     * @description Search function to search through the locations
     * @param {object} value - takes the value from the searchbar
     *
     */
    self.query.subscribe(search = function(value) {
        self.places.removeAll(); // remove all the current places, which removes them from the view
        mapObj.setAllMarkers(null); //also remove the markers from the map
        for (var i = 0; i < locations.length; i++) {
        //iterate through the locations to find the query value (the name of the location)
            if (locations[i].locationName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.places.push(locations[i]);
                self.marker = mapObj.markerArray()[i]; //get the marker data from the array in the mapModel
                self.marker.setMap(mapObj.canvasMap); //set the markers back onto the map
            } 
        } 
    }); 
}; 

sidebarObj.searchLoc(); //activate the searchLoc function
/**
 * @description When a location in the sidebar is highlighted with the mouse we know what marker corresponds with that name
 * @description Do the mouse over and click (when clicked) and bounce the marker and open a window
 * @param {object} element - @location object
 * @param {jQuery object} domEl - returns if mouse is hovered
 */
sidebarObj.selectLocation = function(element, domEl) { //perform some styling.
    console.log('element', element);
    console.log('domEl', domEl);
    var current = domEl.currentTarget;
    $(current).css('color', '#fff').css('cursor', 'pointer').css('background-color', '#5CB85C');
    //sidebarObj.bounceMarker(element.locationName);
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

/**
 * @description Undo the selection in the list
 * @param {object} element - @location object
 * @param {jQuery object} domEl - returns if mouse is hoveredd
 */
sidebarObj.selectLocationUndo = function(element, domEl) {
    $(domEl.currentTarget).css('background-color', '#fff').css('color', '#333');
};

/**
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
ko.applyBindings(mapObj, document.getElementById('map'));
ko.applyBindings(sidebarObj, document.getElementById('sidebar'));
