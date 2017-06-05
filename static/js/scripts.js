
"use strict"


function fetcher(lat, lng){
  var data;
  $.ajax({
      url: 'https://developer.trimet.org/ws/V1/stops',
      method: 'POST',
      data: {'ll': `${lat},${lng}`,
              'appID':'99C513765C3D3D0CD6E17B829',
              'json':'true',
              'meters':'100',
            },
      success: function(rsp){
        console.log(rsp);
        data = rsp;
      },
      error: function(err){
        console.log(err);
    }
  });
}


function initMap(lat, lng) {
  var here = {lat: lat, lng: lng};

  // The Map Itself
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: here
  });

  // Center Marker
  var marker = new google.maps.Marker({
    position: here,
    map: map
  });

}


function getPosition() {
  // Determines User

  if ("geolocation" in navigator) {
    /* geolocation is available */
    console.log('Geolocation enabled');
  } else {
    /* geolocation IS NOT available */
    console.log('Geolocation disabled');
  }

  navigator.geolocation.getCurrentPosition(function(position) {


    initMap(position.coords.latitude, position.coords.longitude);  // Make Map
    fetcher(position.coords.latitude, position.coords.longitude);  // Get Bus Stop Data
    console.log(position.coords.latitude, position.coords.longitude);
  });
}
