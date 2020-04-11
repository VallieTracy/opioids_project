// Creating map object

var mymap = L.map('map')
  .setView([38.27, -100.86], 4);

// map.invalidateSize(true);

// Adding tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: mak_api
}).addTo(mymap);


var link = "http://127.0.0.1:5000/api/v1.0/deathTest";

d3.json(link).then(function(data){
  var d = data;

  var barData = [
      {
          x: data["Deaths per 100,000"]*100,
          y: data["State"]
      }
  ];

  Plotly.newPlot('bar',barData);


});

