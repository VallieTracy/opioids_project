
var salesRadialData;
var stateSelector =  d3.select("#selDataset");
var deathsData;


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

// //adding legend to the map
var legend = L.control({position: "bottomleft"});
legend.onAdd = function(mymap){
  var div = L.DomUtil.create("div", "info legend"),
  limits = [0, 3, 8, 14, 20, 27, 34, 50]

  function colorLegend(array){
    for(var i =0; i<array.length; i++){
      div.innerHTML += '<span style = background-color:' + choroColor(array[i]+1) + '> </span>';
    }
    return div.innerHTML;
  }

  var legendInfo = "<p>Deaths from All Opioids (per 100,000)</p>"+
    "<span>" + limits[0] + "&nbsp;" + colorLegend(limits) + "&nbsp;" + limits[limits.length -1] + "</span>";

  div.innerHTML = legendInfo;

  return div;
};


legend.addTo(mymap);

//filters for the year that the user has selected and colors the map based on deaths from all opioids.
function yearUpdate(year){
  let data = deathsData;

    var allOpioids = [];
    for (var i = 0; i < data.length; i++){
      
      var deaths;
      var state;

      if ((data[i]["Drug Type"] === "All opioids") && (data[i]["Year"] === year)){

        deaths = data[i]["Deaths per 100,000"];
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
      }).bindPopup("<h6>"+ stateInfo[0].State + "</h6> <hr> <p class =\"popup\" >" + deathsValue + " Opioid deaths per 100,000 </p>");
  
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

}
// end yearUpdate Function




function radialChart(curState) {   
  var titleStr = `${curState} Prescription Sales`;
  var chartTitle = d3.select("#radialChartTitle").html(titleStr +  "\<br\>Per 100,000 People");
  let filterData = salesRadialData; 
  
  filterData = filterData.filter(d => d.State === curState);
  console.log("filterData:", filterData);

  var yearSList = filterData.map(s => s.Year);
    
    yearSList.sort();   
    var yearSDictionary = {}; 
    console.log("yearSDictionary:", yearSDictionary);
    yearSList.forEach((year) => {
      if (year in yearSDictionary)
      {
        yearSDictionary[year]++; 
      }
      else
      {
        yearSDictionary[year] = 1; 
      }
    }); 
    
    var newSData = [];
    
    const yearSKeys = Object.keys(yearSDictionary);  
      
    // For each year in the list of years ...
    for (const yearSKey of yearSKeys) {
      // Filter out the oxycodone sales
      var oxyData = filterData.filter(d => d["Oxycodone / Hydrocodone"] === "Oxycodone" && d["Year"] == yearSKey);
      var oxy = oxyData[0]["Prescriptions per 100,000"];
            
      // Filter out the Hydrocodone sales
      var hydroData = filterData.filter(d => d["Oxycodone / Hydrocodone"] === "Hydrocodone" && d["Year"] == yearSKey);
      var hydro = hydroData[0]["Prescriptions per 100,000"]; 
             
      // Build a new dictionary containing the year, Oxycodone prescriptions, and Hydrocodone prescriptions
      var newSDict = {}; 
      newSDict["Year"] = yearSKey;
      newSDict["Oxy"] = oxy;
      newSDict["Hydro"] = hydro; 
      // Finally, add this new dictionary to the array
      newSData.push(newSDict); 
    }
    
    // Vallie's radial chart
    //Chart code 
    /* Create chart instance */
    am4core.ready(function() {
      
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end
      
      /* Create chart instance */
      var chart = am4core.create("chartdivRadial", am4charts.RadarChart);
      
      // Define data
      chart.data = newSData;
      
      /* Create axes */
      var categoryAxis = chart.xAxes.push(new am4charts.DateAxis());
      
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.extraMin = 0.2;
      valueAxis.extraMax = 0.2;
      valueAxis.tooltip.disabled = true;
      
      /* Create and configure series */
      var series1 = chart.series.push(new am4charts.RadarSeries());
      series1.dataFields.valueY = "Oxy";
      series1.dataFields.dateX = "Year";
      series1.strokeWidth = 3;
      series1.tooltipText = "{valueY}";
      series1.name = "Oxycodone";
      series1.bullets.create(am4charts.CircleBullet);
      series1.dataItems.template.locations.dateX = 0.5;
      
      var series2 = chart.series.push(new am4charts.RadarColumnSeries());
      series2.dataFields.valueY = "Hydro";
      series2.dataFields.dateX = "Year";
      series2.strokeWidth = 0.25;
      series2.tooltipText = "{valueY}";
      series2.name = "Hydrocodone";
      series2.columns.template.fill = am4core.color("#CDA2AB");
      series2.dataItems.template.locations.dateX = 0.5;
      
      chart.cursor = new am4charts.RadarCursor();
      
      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom";
      }); // end am4core.ready()
} // end of radialChart function


function stateChange() {
  am4core.disposeAllCharts();
  let curState = this.value;
  radialChart(curState);
}

stateSelector.on("change", stateChange);


//function for when the user selects a state
function optionChanged(newYear){
  //functions for drawing graphs here
  yearUpdate(newYear);
}

//function for initial landing page
function initDashboard(){
  var stateSelector = d3.select("#selDataset");

  d3.json(salesUrl).then(function(sales){
    salesRadialData = sales;
    radialChart("Alabama");
  });  
  d3.json(deathsUrl).then((deaths)=>{
    deathsData = deaths;

    var stateName = [];
    for (var a = 0; a<statesData.features.length; a++){
      stateName.push(statesData.features[a].properties.name);
    }

    stateName.forEach((stateSelect)=>{
      stateSelector.append("option")
        .text(stateSelect)
        .property("value", stateSelect)
    });
    var stateSelect = stateName[0];

    var yearSelector = d3.select("#yrDataset");
    years.forEach((yearSelect)=>{
      yearSelector.append("option")
      .text(yearSelect)
      .property("value", yearSelect)
    });

    var yearSelect = years[0];

    yearUpdate(yearSelect);
    
  });

  //call functions here to draw the initial radial and stacked area graphs for the landing page.
  

}

// call initial landing page function to get landing page to display
initDashboard();

