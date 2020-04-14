var states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Dist. of Columbia", "Florida",
  "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
  "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
  "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
var years = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"];

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
  if (d > 40){  //should probably start a little lower, so that more fall into this other than just one state
    color = "#08306b";
  }
  else if (d > 34){
    color = "#284d81";
  }
  else if (d > 27){
    color = "#476997";
  }
  else if (d > 20){
    color = "#6785ad";
  }
  else if (d > 14){
    color = "#87a2c3";
  }
  else if (d > 8){
    color = "#a6bed9";
  }
  else if (d > 3) {
    color = "#c6dbef";
  }
  else {
    color = "#eef4fa";
  }
  return color;
}

//uses the data and updates the year based on user select
function yearUpdate(year){

  d3.json(deathsUrl).then(function(data){
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

    var stateInfo;
    var deathsValue
    //add color to states
    function style(feature) {
      var stateToFind = feature.properties.name;
      //var opioidsYear = yearUpdate(deaths, year)
      stateInfo = allOpioids.filter(s=> s.State == stateToFind);
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

  
    function onEachFeature(feature, layer) {
      layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
      });
    }
  
    geojson = L.geoJson(statesData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(mymap);
  
    //end highlight on mouse over

  })

}


d3.json(deathsUrl).then(function(deaths){

  //testing for Liz and Vallie's graphs
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


});




//function for when the user selects a state
function optionChanged(newYear){
  //functions for drawing graphs here
  yearUpdate(newYear);

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

    var yearSelect = years[0];

    yearUpdate(yearSelect);
  });

  //call functions here to draw the initial graphs for the landing page.

}

initDashboard();