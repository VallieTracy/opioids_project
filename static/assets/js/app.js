var states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Dist. of Columbia", "Florida",
  "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
  "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
  "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
var years = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2108"];

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



var deathsUrl = "http://127.0.0.1:5000/api/v1.0/deathTest";
var salesUrl = "http://127.0.0.1:5000/api/v1.0/prescriptionTest";

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



d3.json(deathsUrl).then(function(data){
  console.log(data)

  var opioidsTest = [];
  for (var i = 0; i<data.length; i++){
    
    var deaths;
    var state;

    if ((data[i]["Drug Type"]==="All opioids") && (data[i]["Year"]==="2018")){
      //console.log(data[i]["Deaths per 100,000"]);
      deaths = data[i]["Deaths per 100,000"];
      state = data[i]["State"];

      opioidsTest.push({"Deaths": deaths, "State": state});
    }
  };


  // opioidsTest = []
  // for ( var i = 0; i<states.length; i++){
  //   var state = states[i];
  //   var year = "2018";
  //   console.log(data[state][year]["info"]);
  //   if (data[state][year]["info"]["Drug Type"]==="All opioids"){
  //     opioidsTest.push({"State": state, "Deaths": data[state][year]["info"]["Deaths per 100,000"]});
  //   }
  // }
  //console.log(opioidsTest);


  //add color to states
  function style(feature) {
    //console.log(feature.opioidsTest);
    return {
        fillColor: choroColor(feature.opioidsTest),
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


//function for when the user selects a state
function optionChanged(newState){
  //functions for drawing graphs here
}


//function for initial landing page
function initDashboard(){
  var selector = d3.select("#selDataset");

  d3.json(deathsUrl).then((data)=>{
   //console.log(data);

    states.forEach((stateSelect)=>{
      selector.append("option")
        .text(stateSelect)
        .property("value", stateSelect)
    });

    var stateSelect = states[0];
  });

  //call functions here to draw the initial graphs for the landing page.

}

initDashboard();