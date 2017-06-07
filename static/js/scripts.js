// By Migs


"use strict";

let map;
let stopMarkers = [];


function addStoptoTable(index, bus) {
  let busStopIndex = $('<th>', {'scope': 'row'}).text(String(index+1));
  let busLocId = $('<td>').text(bus.locid);
  let busStopDesc =$('<td>').text(bus.desc);
  let busHeading = $('<td>').text(bus.dir);
  let busStopRow = $('<tr>').append(busStopIndex, busLocId, busHeading, busStopDesc);
  $('#busses').append(busStopRow);
}


function makeInfoWindow(bus) {
  //Generates and ads infowindow Html to marker objects
  //
  // desc
  // :
  // "SW Kelly & Corbett"
  // dir
  // :
  // "Northbound"
  // lat
  // :
  // 45.5019212692922
  // lng
  // :
  // -122.675276776225
  // locid
  // :
  // 3116
  let $description = $('<p>').text(bus.desc);
  let $heading = $('<h4>').text(`${bus.locid}  -->  ${bus.dir}`);
  // let $direction =$('<h>').text(bus.dir)
  let $body = $('<section>').append($heading, $description);

  let $content = $('<main>', {'class': 'popUpstyle'}).append($body);

  return $content.html();
}

function addBusStopMarker(bus) {
  // Add a simple bus stop to the map
  var iconBase = 'static/img/MapMarker_Flag1_Left_Pink.png';
  var busStopLoc = new google.maps.LatLng(bus.lat, bus.lng);
  var stopMarker = new google.maps.Marker({
  position: busStopLoc,
  title: bus.desc,
  icon: iconBase
  });

  var contentString = makeInfoWindow(bus);
  var infowindow = new google.maps.InfoWindow({
    content: contentString
    });

    stopMarker.addListener('click', function() {
      infowindow.open(map, stopMarker);
    });

  // To add the marker to the map, call setMap();
    stopMarkers.push(stopMarker);
    stopMarker.setMap(map);
}


function populate(busses){
    $.each(busses, function(index, bus){
      addStoptoTable(index, bus); //Add the stopMarker
      addBusStopMarker(bus)

    });
}

function fetch_arrivals(locID){
//Fetches Arrival data for a single transit location
    var request_params = {'appID':'99C513765C3D3D0CD6E17B829',
                         'json':'true',
                         'locIDs': locID};
     $.ajax({
         type: 'GET',
         data: request_params,
         url: 'https://developer.trimet.org/ws/v2/arrivals',
       }).done(function(response) {
         //you may safely use results here
           console.log("Arrivals..");
           console.log(response);
           let busses = response.resultSet.location;
          //  populate(busses);
       }).fail(function(error) {
           console.log("Errored Out");
           console.log(error);
     });
     }





function fetcher(loc, meters) {
  if (typeof meters === 'undefined') {
    let meters = '125';
  }
  var request_params = {'ll': `${loc.lat}, ${loc.lng}`,
                       'appID':'99C513765C3D3D0CD6E17B829',
                       'json':'true',
                       'meters':meters};


  $.ajax({
      type: 'GET',
      data: request_params,
      url: 'https://developer.trimet.org/ws/V1/stops',
    }).done(function(response) {
        console.log("Retrieved Busses...");
        console.log(response);
        let busses = response.resultSet.location;
        populate(busses);
    }).fail(function(error) {
        console.log("Errored Out");
        console.log(error);
  });
}


function initMap(lat, lng) {
    let here = {lat: lat, lng: lng};                                   // Center Marker

    map = new google.maps.Map(document.getElementById('map'), {        // The Map Itself
      zoom: 17,
      center: here
    });

    let marker = new google.maps.Marker({
      position: here,
      map: map
    });
}


function getPosition() {
  // Determines usres current geolocation

  if ("geolocation" in navigator) {
    /* geolocation is available */
    navigator.geolocation.getCurrentPosition(function(position) {
        let loc = {lat: position.coords.latitude, lng: position.coords.longitude}
        initMap(position.coords.latitude, position.coords.longitude);    // Make Map
        fetcher(loc);    // Get Bus Stop Data
        console.log(loc);
    });
    console.log('Geolocation enabled');
  } else {
    /* geolocation IS NOT available */
    console.log('Geolocation disabled');
  }

}
// Sets the map on all markers in the array.
    function setMapOnAll(map) {
      for (var i = 0; i < stopMarkers.length; i++) {
        stopMarkers[i].setMap(map);
      }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
      setMapOnAll(null);
    }

    // Shows any markers currently in the array.
    function showMarkers() {
      setMapOnAll(map);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
      clearMarkers();
      stopMarkers = [];
    }


function clearTable(){
  $('#busses').empty();
}

function updateStops(event, ui) {
  console.log("Dropped the slider");
  //Get geolocations
  //get new bus data
  // clear the map
  //clear the Table
  //update the map

}

$( function() {
    var handle = $( "#custom-handle" );
    let options = {
      min: 50,
      max: 1500,
      value: 125,
      step: 25,
      create: function() {
        handle.text( $( this ).slider( "value" ) );
      },
      slide: function( event, ui ) {
        handle.text( ui.value );

      },
      stop: function( event, ui) {
        clearMarkers();
        clearTable();
        navigator.geolocation.getCurrentPosition(function(position) {
          let loc = {lat: position.coords.latitude, lng: position.coords.longitude};
            fetcher(loc, ui.value);
        });


      }
    }
    $( '#slider').slider(options);
  });
