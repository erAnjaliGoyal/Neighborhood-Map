var models = [
          {title: 'Chitkara University',placeID: "ChIJ1-KmRCPDDzkRypkX6d5Gs4E", selecton: false, show: true, lat: 30.516034, lng: 76.659699},
          {title: 'West Gate Mall', placeID: "ChIJWXYyc3MDDTkRx0mCjszFfVI",selecton: false, show: true, lat: 28.653111, lng: 77.123052},
          {title: 'Paras Downtown Square Mall', placeID: "ChIJ_c7SvUvrDzkRfa8OVg7CaGk",selecton: false, show: true, lat: 30.659698, lng: 76.822030},
          {title: 'Barbeque Nation', placeID: "ChIJedogrCHtDzkRBEx9LIGhVr4",selecton: false, show: true, lat: 30.726010, lng: 76.805316 },
          {title: 'Babarpur Station',placeID:  "ChIJOUI426DZDTkRpQJOLO-YWUE",selecton: false, show: true, lat: 29.449948, lng: 76.966355},
          {title: 'Japanese Garden',placeID: "ChIJP2EYBvbsDzkRu_PzQbxs7Qw", selecton: false, show: true, lat: 30.703591, lng: 76.782387},
          {title: 'Shimla Reserve Forest Sanctuary',placeID: " ChIJZfpV5ceDBTkRpAciC_a8bvw", selecton: false, show: true, lat: 31.100030, lng: 77.246338},
          {title: 'pawan garments', placeID: "ChIJZ8_uNI7sDzkRpY_hWG-eEuo",selecton: false, show: true, lat: 30.689929, lng: 76.790183 },
          {title: 'Panjab University',placeID: "ChIJ27w-eojtDzkRlmHXip3S47k",selecton: false, show: true, lat: 30.667780, lng: 76.817802 },
          {title: 'Mall Road',placeID: "ChIJMRlyjJV4BTkReIOyfWfxSOQ",selecton: false, show: true, lat: 32.243962, lng: 77.189445 }
];

var styles = [
          {
            featureType: 'water',
            stylers: [
              { color: '#19a0d8' }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#ffffff' },
              { weight: 6 }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
          },{
            featureType: 'transit.station',
            stylers: [
              { weight: 9 },
              { hue: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
              { visibility: 'off' }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              { lightness: -100 }
            ]
          },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              { visibility: 'on' },
              { color: '#f0e4d3' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -25 }
            ]
          }
        ];

var viewModel = function() {

  var self = this;
  self.inputText = ko.observable('');
  self.placesList = [];
  self.disError = ko.observable('');
  self.makeMarkerIcon = function(markerColor) {
  
  var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      };


  var largeInfowindow = new google.maps.InfoWindow();
  var defaultIcon = self.makeMarkerIcon('0091ff');
  var highlightedIcon = self.makeMarkerIcon('FFFF24');
        



  models.forEach(function(indexMarker){

        var marker = new google.maps.Marker({
        position: {lat: indexMarker.lat, lng: indexMarker.lng},
        map: map,
        title: indexMarker.title,
        selection: ko.observable(indexMarker.selection),
        show: ko.observable(indexMarker.show),  
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: 1
  });

    self.placesList.push(marker);

  marker.addListener('click', function() {
      self.makeBounce(marker);
      self.populateInfoWindow(this, largeInfowindow);
      self.addApiInfo(marker);
  });

          // Two event listeners - one for mouseover, one for mouseout,
      // to change the colors back and forth.
  marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });
  marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });

  });

    self.placesLength = self.placesList.length;
    //self.curItem = self.placesList[0];

    self.populateInfoWindow = function(marker, infowindow) {
    
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          // Clear the infowindow content to give the streetview time to load.
          infowindow.setContent('');
          infowindow.marker = marker;
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });

          var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options

      self.getStreetView = function(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
        infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
      };
    
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, self.getStreetView(marker.position,radius));
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
       }
    };

    self.addApiInfo = function(indexMarker){
          $.ajax({
            url: "https://api.foursquare.com/v2/venues/" + indexMarker.placeID + '&client_id=MHNQGZARQHKHVXJ0W2GO5BK3NZHOUJSHMTWL1YQEPMTXKJ01&client_secret=5SYVCHXBOGZZEOJ2BHT2QKT2TO4FKGTEL1TCDWE11VDGKQSF',
            dataType: "json",
            success: function(data){
              // stores results to display likes and ratings
              var result = data.response.venue;

              // add likes and ratings to marker
              indexMarker.likes = result.hasOwnProperty('likes') ? result.likes.summary: "";
              indexMarker.rating = result.hasOwnProperty('rating') ? result.rating: "";
            },
            //alert if there is error in recievng json
            error: function(e) {
              self.disError("fourSquare data not available");
            }
          });
    };

    self.makeBounce = function(indexMarker){
      indexMarker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ indexMarker.setAnimation(null);},999);
    };

    self.undoneMarks = function() {
      for (var i = 0; i < self.placesLength; i++) {
      self.placesList[i].selection(false);
      }
    };


    self.doneMark = function(location) {
      self.undoneMarks();

        location.selection(true);

        self.currentMapItem = location;

        formattedLikes = function() {
          if (self.currentMapItem.likes === "" || self.currentMapItem.likes === undefined) {
            return "No likes to display";
          } else {
            return "Location has " + self.currentMapItem.likes;
          }
        };

        formattedRating = function() {
          if (self.currentMapItem.rating === "" || self.currentMapItem.rating === undefined) {
            return "No rating to display";
          } else {
            return "Location is rated " + self.currentMapItem.rating;
          }
        };

        var formattedInfoWindow = "<h5>" + self.currentMapItem.name + "</h5>" + "<div>" + formattedLikes() + "</div>" + "<div>" + formattedRating() + "</div>";

    infowindow.setContent(formattedInfoWindow);

        infowindow.open(map, location);

       self.makeBounce(location);
    };

    self.listUpdate = function() {
      infowindow.close();
      var inputText = self.inputText();
    
      if (inputText.length == 0) {
		    for (var i = 0; i < self.placesLength; i++) {
          self.placesList[i].show(true);
          self.placesList[i].setVisible(true);
        }	
      } 
      else {
			 for (var i = 0; i < self.placesLength; i++) {
			   	if (self.placesList[i].title.toLowerCase().indexOf(inputText.toLowerCase()) > -1) {
				  	self.placesList[i].show(true);
					 self.placesList[i].setVisible(true);
				  } 
          else {
					self.placesList[i].show(false);
					self.placesList[i].setVisible(false);
				  }
			 }
      }
          infowindow.close();
    };
};

