// Creating map object
var mymap = L.map('map')
  .setView([38.27, -95.86], 4);

// Adding tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);



var deathURL = "http://127.0.0.1:5000/api/v1.0/deathTest";
var PresURL = "http://127.0.0.1:5000/api/v1.0/prescriptionTest";

// coloring for choropleth.
function choroColor(d){
  // min for all opioids = 0.65003, max for all opioids = 49.60242
  var color = "";
  if (d > 49){
    color = "#08306b";
  }
  else if (d > 42){
    color = "#284d81";
  }
  else if (d > 35){
    color = "#476997";
  }
  else if (d > 28){
    color = "#6785ad";
  }
  else if (d > 21){
    color = "#87a2c3";
  }
  else if (d > 14){
    color = "#a6bed9";
  }
  else if (d > 7) {
    color = "#c6dbef";
  }
  else {
    color = "#eef4fa";
  }
  return color;
}



d3.json(deathURL).then(function(data){
  //console.log(data)

  //convert numerical values from their current string form
  for ( var q=0; q<data.length; q++){
    if (data[q]["Deaths per 100,000"] !== "N/A"){
      data[q]["Deaths per 100,000"] =+ data[q]["Deaths per 100,000"]
    }
  }

  var opioidsTest = [];
  var deathsTest = [];
  for (var i = 0; i<data.length; i++){
    
    
    var state;

    if ((data[i]["Drug Type"]==="All opioids") && (data[i]["Year"]=="2018")){

      deaths = data[i]["Deaths per 100,000"];
      state = data[i]["State"];
      deathsTest.push(deaths);
      opioidsTest.push({"Deaths": deaths, "State": state});
    }
    
    
  };

  console.log(opioidsTest);
  console.log(deathsTest);


  //add color to states
  function style(feature) {
    return {
        fillColor: choroColor(opioidsTest),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
  }
  // adds state outlines
  L.geoJson(statesData, {style: style}).addTo(mymap);


  // start highlight on mouse over
  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
  }

  geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(mymap);
  //end highlight on mouse over

});

