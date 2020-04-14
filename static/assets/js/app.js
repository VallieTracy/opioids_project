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



var deathsUrl = "/api/v1.0/deathTest";
var salesUrl = "/api/v1.0/prescriptionTest";

// coloring for choropleth.
function choroColor(d){
  // min for all opioids = 0.65003, max for all opioids = 49.60242
  var color = "";
  if (d > 49){  //should probably start a little lower, so that more fall into this other than just one state
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

//uses the data and updates the year based on user select
function yearUpdate(data, year){
  var allOpioids = [];
  for (var i = 0; i < data.length; i++){
    
    var deaths;
    var state;

    if ((data[i]["Drug Type"] === "All opioids") && (data[i]["Year"] === year)){

      deaths = parseFloat(data[i]["Deaths per 100,000"]);
      state = data[i]["State"];

      allOpioids.push({"Deaths": deaths, "State": state});
    }
  }
  return allOpioids;
}


d3.json(deathsUrl).then(function(deaths){
// const minYear = "2000";
// const maxYear = "2018";

// for (i = minYear; i<maxYear; i++){
 

//   thisYear = deaths.filter(d=>d.Year === i);
//   // console.log(thisYear);
//   synthetic = thisYear.filter(dt=>dt["Drug Type"] === "Synthetic opioids");
//   // console.log(synthetic);
//   var syntheticDeaths=[];
//   for (var j = 0; j<synthetic.length; j++){
//     syntheticDeaths.push(synthetic[j]["Deaths per 100,000"]);

//   }
//   //console.log(syntheticDeaths);
//   var object = {"Total Synthetic": syntheticDeaths}
//   console.log(object);

// }

  var stateInfo;
  var deathsValue
  //add color to states
  function style(feature) {
    var stateToFind = feature.properties.name;
    var opioidsYear = yearUpdate(deaths, "2018")
    stateInfo = opioidsYear.filter(s=> s.State == stateToFind);
    //console.log(stateInfo);

    deathsValue = stateInfo[0].Deaths

    return {
        fillColor: choroColor(deathsValue),
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
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    }).bindPopup("<h6>"+ stateInfo[0].State + "</h6> <hr> <h7> All opioid deaths per 100,000: " + deathsValue + "</h7>");

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  // function zoomToFeature(e) {
  //   map.fitBounds(e.target.getBounds());
  // }

  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        //click: zoomToFeature
    });
  }


  geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(mymap);

  //end highlight on mouse over


  // // testing for overlays for years
  // function onEachFeature(feature, layer){
  //   layer.on({
  //     click:(function(){
  //       updateMaps(feature, layer);
  //     }).bind(this)
  //   })
  // }


  // yearUpdate(deaths, "2000");
  // var layer00 = L.geoJson(statesData,{
  //   style:style,
  //   onEachFeature: onEachFeature
  // })

  // yearUpdate(deaths, "2001");
  // var layer01 = L.geoJson(statesData,{
  //   style:style,
  //   onEachFeature: onEachFeature
  // })

  // yearUpdate(deaths, "20002");
  // var layer02 = L.geoJson(statesData,{
  //   style:style,
  //   onEachFeature: onEachFeature
  // })

  // yearUpdate(deaths, "20003");
  // var layer03 = L.geoJson(statesData,{
  //   style:style,
  //   onEachFeature: onEachFeature
  // })


  // var overlays = {
  //   2000:layer00
  // }

  // // layer control for baseMaps
  // L.control.layers(overlays, {
  //   collapsed: false
  // }).addTo(mymap);

  // mymap = L.map('map', {
  //   center: [38.27, -95.86],
  //   zoom: 4,
  //   layers: [layer00]
  // });
  // // end test for adding radio dial of years to map

});







//function for when the user selects a state
function optionChanged(newState){
  //functions for drawing graphs here
}


//function for initial landing page
function initDashboard(){
  var stateSelector = d3.select("#selDataset");

  d3.json(deathsUrl).then((deaths)=>{

    states.forEach((stateSelect)=>{
      stateSelector.append("option")
        .text(stateSelect)
        .property("value", stateSelect)
    });

    var stateSelect = states[0];

    var yearSelector = d3.select("#yrDataset");
    years.forEach((yearSelect)=>{
      yearSelector.append("option")
      .text(yearSelect)
      .property("value", yearSelect)
    });

    var yearSelect = years[0]
;
  });

  //call functions here to draw the initial graphs for the landing page.

}

initDashboard();