function initMap() {
  var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}


function fetcher(){
  var data;
  $.ajax({
      url: 'https://developer.trimet.org/ws/V1/stops',
      method: 'GET',
      data: {'ll': '-122.674731, 45.502257',
              'appID':'99C513765C3D3D0CD6E17B829',
              'json':'true',
              'meters':'100'
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
