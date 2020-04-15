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

//adding legend to the map
var legend = L.control({position: "bottomleft"});
legend.onAdd = function(mymap){
  var div = L.DomUtil.create("div", "info legend"),
  limits = [0, 3, 8, 14, 20, 27, 34, 40]
  div.innerHTML += '<p>Deaths from All Opioids, per 100,000</p>'
  for(var i =0; i<limits.length; i++){

    div.innerHTML += '<span style = background-color:' +choroColor(limits[i]+1) + '>' +
    limits[i]+(limits[i+1] ? '&ndash;' + limits[i+1] : ' + </span>');
  }
  return div;
};
legend.addTo(mymap);

//filters for the year that the user has selected and colors the map based on deaths from all opioids.
function yearUpdate(year){
  d3.json(deathsUrl).then(function(data){

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
  d3.json(salesUrl).then(function(sales){
    for (var q=0; q<deaths.length; q++){
        deaths[q]["Deaths per 100,000"] =+ deaths[q]["Deaths per 100,000"];
        deaths[q]["Year"] =+ deaths[q]["Year"];
    }

    for (var q =0; q<sales.length; q++){
        sales[q]["Year"] =+ sales[q]["Year"];
        sales[q]["Prescriptions per 100,000"] =+ sales[q]["Prescriptions per 100,000"];
    }


    //LIZ SECTION

    // Determine the range of year by building an object 
    // and adding a key for each year. We've used a similar
    // strategy in class activities.
    var yearList = sales.map(s => s.Year);
    yearList.sort();   
    var yearDictionary = {}; 
    yearList.forEach((year) => {
      
      if (year in yearDictionary)
      {
        yearDictionary[year]++; 
      }
      else
      {
        yearDictionary[year] = 1; 
      }
    }); 
    // Show the format of the yearDictionary
    // console.log("yearDictionary"); 
    // console.log(yearDictionary); 
    var deathData = [];
    const yearKeys = Object.keys(yearDictionary);     
    // For each year in the list of years ...
    for (const yearKey of yearKeys) {
      //console.log(deaths);
      // ... filter out the Oxycodone values and sum them up for each state
      var heroinData = deaths.filter(d => d["Drug Type"] === "Heroin" && d["Year"] == yearKey);
      //console.log(heroinData);
      var heroinSum = 0.0;
      heroinData.forEach((item) => {
        //console.log(item["Deaths per 100,000"])
        if (isNaN(item["Deaths per 100,000"]) == false){
          heroinSum += item["Deaths per 100,000"];
        }
      });
      //console.log(heroinSum)
      // console.log(`year: ${yearKey}, oxySum: ${oxySum}`); 
      // console.log(`year: ${yearKey}, hydroSum: ${hydroSum}`); 
      // Build a new dictionary containing the year, Oxycodone prescriptions, and Hydrocodone prescriptions
      var deathDict = {}; 
      deathDict["Year"] = yearKey;
      deathDict["Heroin"] = heroinSum; //another
      // Finally, add this new dictionary to the array
      deathData.push(deathDict); 
    }
    console.log("DeathData"); 
    console.log(deathData);  


    //Liz Graph

    // var chart = am4core.create("chartdiv", am4charts.XYChart);
    // chart.data = [{
    //   "year": "1994",
    //   "cars": 1587,
    //   "motorcycles": 650,
    //   "bicycles": 121
    // }, {
    //   "year": "1995",
    //   "cars": 1567,
    //   "motorcycles": 683,
    //   "bicycles": 146
    // }, {
    //   "year": "1996",
    //   "cars": 1617,
    //   "motorcycles": 691,
    //   "bicycles": 138
    // }, {
    //   "year": "1997",
    //   "cars": 1630,
    //   "motorcycles": 642,
    //   "bicycles": 127
    // }, {
    //   "year": "1998",
    //   "cars": 1660,
    //   "motorcycles": 699,
    //   "bicycles": 105
    // }, {
    //   "year": "1999",
    //   "cars": 1683,
    //   "motorcycles": 721,
    //   "bicycles": 109
    // }, {
    //   "year": "2000",
    //   "cars": 1691,
    //   "motorcycles": 737,
    //   "bicycles": 112
    // }, {
    //   "year": "2001",
    //   "cars": 1298,
    //   "motorcycles": 680,
    //   "bicycles": 101
    // }, {
    //   "year": "2002",
    //   "cars": 1275,
    //   "motorcycles": 664,
    //   "bicycles": 97
    // }, {
    //   "year": "2003",
    //   "cars": 1246,
    //   "motorcycles": 648,
    //   "bicycles": 93
    // }, {
    //   "year": "2004",
    //   "cars": 1318,
    //   "motorcycles": 697,
    //   "bicycles": 111
    // }, {
    //   "year": "2005",
    //   "cars": 1213,
    //   "motorcycles": 633,
    //   "bicycles": 87
    // }, {
    //   "year": "2006",
    //   "cars": 1199,
    //   "motorcycles": 621,
    //   "bicycles": 79
    // }, {
    //   "year": "2007",
    //   "cars": 1110,
    //   "motorcycles": 210,
    //   "bicycles": 81
    // }, {
    //   "year": "2008",
    //   "cars": 1165,
    //   "motorcycles": 232,
    //   "bicycles": 75
    // }, {
    //   "year": "2009",
    //   "cars": 1145,
    //   "motorcycles": 219,
    //   "bicycles": 88
    // }, {
    //   "year": "2010",
    //   "cars": 1163,
    //   "motorcycles": 201,
    //   "bicycles": 82
    // }, {
    //   "year": "2011",
    //   "cars": 1180,
    //   "motorcycles": 285,
    //   "bicycles": 87
    // }, {
    //   "year": "2012",
    //   "cars": 1159,
    //   "motorcycles": 277,
    //   "bicycles": 71
    // }];
    // chart.dateFormatter.inputDateFormat = "yyyy";
    // var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis.renderer.minGridDistance = 60;
    // dateAxis.startLocation = 0.5;
    // dateAxis.endLocation = 0.5;
    // dateAxis.baseInterval = {
    //   timeUnit: "year",
    //   count: 1
    // }
    // var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.tooltip.disabled = true;
    // var series = chart.series.push(new am4charts.LineSeries());
    // series.dataFields.dateX = "year";
    // series.name = "cars";
    // series.dataFields.valueY = "cars";
    // series.tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/car.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
    // series.tooltipText = "[#000]{valueY.value}[/]";
    // series.tooltip.background.fill = am4core.color("#FFF");
    // series.tooltip.getStrokeFromObject = true;
    // series.tooltip.background.strokeWidth = 3;
    // series.tooltip.getFillFromObject = false;
    // series.fillOpacity = 0.6;
    // series.strokeWidth = 2;
    // series.stacked = true;
    // var series2 = chart.series.push(new am4charts.LineSeries());
    // series2.name = "motorcycles";
    // series2.dataFields.dateX = "year";
    // series2.dataFields.valueY = "motorcycles";
    // series2.tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/motorcycle.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
    // series2.tooltipText = "[#000]{valueY.value}[/]";
    // series2.tooltip.background.fill = am4core.color("#FFF");
    // series2.tooltip.getFillFromObject = false;
    // series2.tooltip.getStrokeFromObject = true;
    // series2.tooltip.background.strokeWidth = 3;
    // series2.sequencedInterpolation = true;
    // series2.fillOpacity = 0.6;
    // series2.stacked = true;
    // series2.strokeWidth = 2;
    // var series3 = chart.series.push(new am4charts.LineSeries());
    // series3.name = "bicycles";
    // series3.dataFields.dateX = "year";
    // series3.dataFields.valueY = "bicycles";
    // series3.tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/bicycle.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
    // series3.tooltipText = "[#000]{valueY.value}[/]";
    // series3.tooltip.background.fill = am4core.color("#FFF");
    // series3.tooltip.getFillFromObject = false;
    // series3.tooltip.getStrokeFromObject = true;
    // series3.tooltip.background.strokeWidth = 3;
    // series3.sequencedInterpolation = true;
    // series3.fillOpacity = 0.6;
    // series3.defaultState.transitionDuration = 1000;
    // series3.stacked = true;
    // series3.strokeWidth = 2;
    // chart.cursor = new am4charts.XYCursor();
    // chart.cursor.xAxis = dateAxis;
    // chart.scrollbarX = new am4core.Scrollbar();
    // // Add a legend
    // chart.legend = new am4charts.Legend();
    // chart.legend.position = "top";
    // // axis ranges
    // var range = dateAxis.axisRanges.create();
    // range.date = new Date(2001, 0, 1);
    // range.endDate = new Date(2003, 0, 1);
    // range.axisFill.fill = chart.colors.getIndex(7);
    // range.axisFill.fillOpacity = 0.2;
    // range.label.text = "Fines for speeding increased";
    // range.label.inside = true;
    // range.label.rotation = 90;
    // range.label.horizontalCenter = "right";
    // range.label.verticalCenter = "bottom";
    // var range2 = dateAxis.axisRanges.create();
    // range2.date = new Date(2007, 0, 1);
    // range2.grid.stroke = chart.colors.getIndex(7);
    // range2.grid.strokeOpacity = 0.6;
    // range2.grid.strokeDasharray = "5,2";
    // range2.label.text = "Motorcycle fee introduced";
    // range2.label.inside = true;
    // range2.label.rotation = 90;
    // range2.label.horizontalCenter = "right";
    // range2.label.verticalCenter = "bottom";
    // end am4core.ready

    //END LIZ SECTION
    
    //VALLIE SECTION
    // Determine the range of year by building an object 
    // and adding a key for each year. We've used a similar
    // strategy in class activities.
    var yearSList = sales.map(s => s.Year);
    yearSList.sort();   
    var yearSDictionary = {}; 
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
    // Show the format of the yearDictionary
    console.log("yearSDictionary"); 
    console.log(yearSDictionary); 
    // Next, extract the prescription data for each drug type. Note that this currently
    // addes together all of the prescription data for each state--so you can't currently
    // filter by a particular state. Yes, it's possible to filter by state, but ... one
    // thing at a time.
    var newSData = [];
    const yearSKeys = Object.keys(yearSDictionary);     
    // For each year in the list of years ...
    for (const yearSKey of yearSKeys) {
      // ... filter out the Oxycodone values and sum them up for each state
      var oxyData = sales.filter(d => d["Oxycodone / Hydrocodone"] === "Oxycodone" && d["Year"] == yearSKey);
      var oxySum = 0.0;
      oxyData.forEach((item) => {
        oxySum += item["Prescriptions per 100,000"]; 
      });
      // ... filter out the Hydrocodone values and sum them up for each state
      var hydroData = sales.filter(d => d["Oxycodone / Hydrocodone"] === "Hydrocodone" && d["Year"] == yearSKey);
      var hydroSum = 0.0; 
      hydroData.forEach((item) => {
        hydroSum += item["Prescriptions per 100,000"]; 
      });
      // console.log(`year: ${yearKey}, oxySum: ${oxySum}`); 
      // console.log(`year: ${yearKey}, hydroSum: ${hydroSum}`); 
      // Build a new dictionary containing the year, Oxycodone prescriptions, and Hydrocodone prescriptions
      var newSDict = {}; 
      newSDict["Year"] = yearSKey;
      newSDict["Oxy"] = oxySum;
      newSDict["Hydro"] = hydroSum; 
      // Finally, add this new dictionary to the array
      newSData.push(newSDict); 
    }
    // newData now contains an array of objects, where each object looks
    // like this:
    // { "Year": "2000",
    //   "Oxy":  316.74734,
    //   "Hydro": 247.3340 }
    // Here's a look at newData
    console.log("newSData"); 
    console.log(newSData);

    // Dinking around before tutoring session
    console.log("[0]:", newSData[0]);
    for (var k = 0; k < newSData.length; k++) {
      console.log("[k]:", newSData[k]);
    }



    // -------------------------------------------------------------------------------------------------------------
    // DOM's CODE, BUT FOR DEATHS AS OPPOSED TO SALES
    // Determine the range of year by building an object 
    // and adding a key for each year. We've used a similar
    // strategy in class activities.
    var yearList = deaths.map(d => d.Year);
    yearList.sort();   
    var yearDictionary = {}; 
    yearList.forEach((year) => {
      if (year in yearDictionary)
      {
        yearDictionary[year]++; 
      }
      else
      {
        yearDictionary[year] = 1; 
      }
    }); 
    // // Show the format of the yearDictionary
    console.log("yearDDictionary"); 
    console.log(yearDictionary); 
    // // Next, extract the prescription data for each drug type. Note that this currently
    // // addes together all of the prescription data for each state--so you can't currently
    // // filter by a particular state. Yes, it's possible to filter by state, but ... one
    // // thing at a time.
    var newData = [];
    //const yearKeys = Object.keys(yearDictionary);     
    // // For each year in the list of years ...
    for (const yearKey of yearKeys) {
    //   // ... filter out the Oxycodone values and sum them up for each state
      var natData = deaths.filter(d => d["Drug Type"] === "Natural and semi-synthetic opioids" && d["Year"] == yearKey);
      var natSum = 0.0;
      natData.forEach((item) => {
        if (isNaN(item["Deaths per 100,000"]) == false){
          natSum += item["Deaths per 100,000"];
        }
      });
    //   // ... filter out the Hydrocodone values and sum them up for each state
    //   var hydroData = sales.filter(d => d["Oxycodone / Hydrocodone"] === "Hydrocodone" && d["Year"] == yearKey);
    //   var hydroSum = 0.0; 
    //   hydroData.forEach((item) => {
    //     hydroSum += parseFloat(item["Prescriptions per 100,000"]); 
    //   });
      console.log(`year: ${yearKey}, natSum: ${natSum}`); 
      //console.log(`year: ${yearDKey}, hydroSum: ${hydroSum}`); 
    //   // Build a new dictionary containing the year, Oxycodone prescriptions, and Hydrocodone prescriptions
      var newDict = {}; 
      newDict["Year"] = yearKey;
      newDict["Nat"] = natSum;
    //   newDDict["Hydro"] = hydroSum; 
    //   // Finally, add this new dictionary to the array
      newData.push(newDict); 
    }
    // // newData now contains an array of objects, where each object looks
    // // like this:
    // // { "Year": "2000",
    // //   "Oxy":  316.74734,
    // //   "Hydro": 247.3340 }
    // // Here's a look at newData
    console.log("newData"); 
    console.log(newData);
    // END OF DOM'S CODE BUT DUPLICATED FOR THE DEATHS AS OPPOSED TO SALES
    // -------------------------------------------------------------------------------------


    // Vallie's radial chart
    //Chart code 
    /* Create chart instance */
    var chart = am4core.create("chartdivRadial", am4charts.RadarChart);
    /* Add data */
    chart.data = newSData;
    
    /* Create axes */
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "Year";
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    /* Create and configure series */
    var series = chart.series.push(new am4charts.RadarSeries());
    series.dataFields.valueY = "Oxy";
    series.dataFields.categoryX = "Year";
    series.name = "Oxy";
    series.strokeWidth = 3;
    series.zIndex = 2;
    var series2 = chart.series.push(new am4charts.RadarColumnSeries());
    series2.dataFields.valueY = "Hydro";
    series2.dataFields.categoryX = "Year";
    series2.name = "Hydro";
    series2.strokeWidth = 0;
    series2.columns.template.fill = am4core.color("#CDA2AB");
    series2.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";

    chart.legend = new am4charts.Legend();

    
  }) //end of sales json

}); //end of death json




//function for when the user selects a state
function optionChanged(newYear){
  //functions for drawing graphs here
  yearUpdate(newYear);

}


//function for initial landing page
function initDashboard(){
  var stateSelector = d3.select("#selDataset");

  d3.json(deathsUrl).then((deaths)=>{
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