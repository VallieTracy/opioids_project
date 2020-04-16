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
      }).bindPopup("<h6>"+ stateInfo[0].State + "</h6> <hr> <p class =\"popup\">" + deathsValue + " Opioid deaths per 100,000 </p>");
  
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


      //Liz code for nat and semi deaths


        //console.log(deaths);
        // ... filter out the Oxycodone values and sum them up for each state
        var natSemiData = deaths.filter(d => d["Drug Type"] === "Natural and semi-synthetic opioids" && d["Year"] == yearKey);
        //console.log(natSemiData);
        var natSemiSum = 0.0;
        natSemiData.forEach((item) => {
          //console.log(item["Deaths per 100,000"])
          if (isNaN(item["Deaths per 100,000"]) == false){
            natSemiSum += item["Deaths per 100,000"];
          }
        });


          //console.log(deaths);
          // ... filter out the Oxycodone values and sum them up for each state
          var syntheticData = deaths.filter(d => d["Drug Type"] === "Synthetic opioids" && d["Year"] == yearKey);
          console.log(syntheticData);
          var syntheticSum = 0.0;
          syntheticData.forEach((item) => {
            //console.log(item["Deaths per 100,000"])
            if (isNaN(item["Deaths per 100,000"]) == false){
              syntheticSum += item["Deaths per 100,000"];
            }
          });


      //console.log(heroinSum)
      // console.log(`year: ${yearKey}, oxySum: ${oxySum}`); 
      // console.log(`year: ${yearKey}, hydroSum: ${hydroSum}`); 
      // Build a new dictionary containing the year, Oxycodone prescriptions, and Hydrocodone prescriptions
      var deathDict = {}; 
      deathDict["Year"] = yearKey;
      deathDict["Heroin"] = heroinSum; 
      deathDict["NatSemi"] = natSemiSum;
      deathDict["Synthetic"]= syntheticSum;
      

      // Liz code trying to add deaths from opioids
      //deathDict["NatSemi"] = natSemiSum;

      // Finally, add this new dictionary to the array
      deathData.push(deathDict); 
    }
    //console.log("DeathData"); 
    console.log(deathData);  


    //Liz Graph


    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.data = deathData; 



    chart.dateFormatter.inputDateFormat = "yyyy";
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.baseInterval = {
      timeUnit: "Year",
      count: 1
    }
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "Year";
    series.name = "Heroin";
    series.dataFields.valueY = "Heroin";
    //series.tooltipHTML = "<img src='C:\Users\lizba\Desktop";
    series.tooltipText = "[#000]{valueY.value}[/]";
    series.tooltip.background.fill = am4core.color("#FFF");
    series.tooltip.getStrokeFromObject = true;
    series.tooltip.background.strokeWidth = 3;
    series.tooltip.getFillFromObject = false;
    series.fillOpacity = 0.6;
    series.strokeWidth = 2;
    series.stacked = true;
    
    
    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.name = "NatSemi";
    series2.dataFields.dateX = "Year";
    series2.dataFields.valueY = "NatSemi";
    series2.tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/motorcycle.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
    series2.tooltipText = "[#000]{valueY.value}[/]";
    series2.tooltip.background.fill = am4core.color("#FFF");
    series2.tooltip.getFillFromObject = false;
    series2.tooltip.getStrokeFromObject = true;
    series2.tooltip.background.strokeWidth = 3;
    series2.sequencedInterpolation = true;
    series2.fillOpacity = 0.6;
    series2.stacked = true;
    series2.strokeWidth = 2;
    
    
    var series3 = chart.series.push(new am4charts.LineSeries());
    series3.name = "Synthetic";
    series3.dataFields.dateX = "Year";
    series3.dataFields.valueY = "Synthetic";
    series3.tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/bicycle.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
    series3.tooltipText = "[#000]{valueY.value}[/]";
    series3.tooltip.background.fill = am4core.color("#FFF");
    series3.tooltip.getFillFromObject = false;
    series3.tooltip.getStrokeFromObject = true;
    series3.tooltip.background.strokeWidth = 3;
    series3.sequencedInterpolation = true;
    series3.fillOpacity = 0.6;
    series3.defaultState.transitionDuration = 1000;
    series3.stacked = true;
    series3.strokeWidth = 2;
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.scrollbarX = new am4core.Scrollbar();
    
    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";
    // axis ranges
    var range = dateAxis.axisRanges.create();
    range.date = new Date(2001, 0, 1);
    range.endDate = new Date(2003, 0, 1);
    range.axisFill.fill = chart.colors.getIndex(7);
    range.axisFill.fillOpacity = 0.2;
    //range.label.text = "Fines for speeding increased";
    range.label.inside = true;
    range.label.rotation = 90;
    range.label.horizontalCenter = "right";
    range.label.verticalCenter = "bottom";
    var range2 = dateAxis.axisRanges.create();
    range2.date = new Date(2007, 0, 1);
    range2.grid.stroke = chart.colors.getIndex(7);
    range2.grid.strokeOpacity = 0.6;
    range2.grid.strokeDasharray = "5,2";
    //range2.label.text = "Motorcycle fee introduced";
    range2.label.inside = true;
    range2.label.rotation = 90;
    range2.label.horizontalCenter = "right";
    range2.label.verticalCenter = "bottom";

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

    // console.log("newData"); 
    // console.log(newData);
    // END OF DOM'S CODE BUT DUPLICATED FOR THE DEATHS AS OPPOSED TO SALES
    // -------------------------------------------------------------------------------------


    // Vallie's radial chart
    //Chart code 
    /* Create chart instance */
    am4core.ready(function() {

      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end
      
      /* Create chart instance */
      var chart = am4core.create("chartdivRadial", am4charts.RadarChart);
      
      // var data = [];
      // var value1 = 500;
      // var value2 = 600;
      
      // for(var i = 0; i < 12; i++){
      //   let date = new Date();
      //   date.setMonth(i, 1);
      //   value1 -= Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 50);
      //   value2 -= Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 50);
      //   data.push({date:date, value1:value1, value2:value2})
      // }
      
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
      series1.tooltipText = "{name}\nSales/100k: {valueY}";
      series1.name = "Oxycodone";
      series1.bullets.create(am4charts.CircleBullet);
      series1.dataItems.template.locations.dateX = 0.5;
      
      var series2 = chart.series.push(new am4charts.RadarColumnSeries());
      series2.dataFields.valueY = "Hydro";
      series2.dataFields.dateX = "Year";
      series2.strokeWidth = 0.5;
      series2.tooltipText = "{name}\nSales/100k: {valueY}";
      series2.name = "Hydrocodone";
      series2.columns.template.fill = am4core.color("#CDA2AB");
      series2.dataItems.template.locations.dateX = 0.5;
      
      //chart.scrollbarX = new am4core.Scrollbar();
      //chart.scrollbarY = new am4core.Scrollbar();
      
      chart.cursor = new am4charts.RadarCursor();
      
      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom";
      
       
      
      }); // end am4core.ready()



    // MORE BASIC CHART
    // var chart = am4core.create("chartdivRadial", am4charts.RadarChart);
    // /* Add data */
    // chart.data = newSData;
    
    // /* Create axes */
    // var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    // categoryAxis.dataFields.category = "Year";
    // var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // /* Create and configure series */
    // var series = chart.series.push(new am4charts.RadarSeries());
    // series.dataFields.valueY = "Oxy";
    // series.dataFields.categoryX = "Year";
    // series.name = "Oxy";
    // series.strokeWidth = 3;
    // series.zIndex = 2;
    // var series2 = chart.series.push(new am4charts.RadarColumnSeries());
    // series2.dataFields.valueY = "Hydro";
    // series2.dataFields.categoryX = "Year";
    // series2.name = "Hydro";
    // series2.strokeWidth = 0;
    // series2.columns.template.fill = am4core.color("#CDA2AB");
    // series2.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";

    // chart.legend = new am4charts.Legend();

    
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