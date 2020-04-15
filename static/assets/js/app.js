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
    accessToken: API_KEY
}).addTo(mymap);

var deathsUrl = "/api/v1.0/deathTest";
var salesUrl = "/api/v1.0/prescriptionTest";

var deathsDB, salesDB;

d3.json(deathsUrl).then(function(deaths){
  d3.json(salesUrl).then(function(sales) {

    for (var q=0; q<deaths.length; q++){
    
      deaths[q]["Deaths per 100,000"] =+ deaths[q]["Deaths per 100,000"];
      deaths[q]["Year"] =+ deaths[q]["Year"];
    }
  
    for (var q =0; q<sales.length; q++){
      sales[q]["Year"] =+ sales[q]["Year"];
      sales[q]["Prescriptions per 100,000"] =+ sales[q]["Prescriptions per 100,000"];
    }

    deathsDB = deaths;
    salesDB = sales;
    console.log("salesDB:", salesDB);
    console.log("deathsDB:", deathsDB);
    // State selector drop down for Radial Chart
    var sel = d3.select('#stateSelect');
    sel.html('');

    var states = [];
    
    // Push each new state into the empty states array
    sales.forEach(obj => {
      if(!states.includes(obj.State)) {
        states.push(obj.State);
      }
    }); 
    
    // Populates the dropdown menu
    states.forEach(state => {
      sel
        .append('option')
        .text(state);
    });


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
    const yearKeys = Object.keys(yearDictionary);     

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

    // Testing to see what I can pull out of the data, just for funsies!
    console.log() 


  }); // end of d3.json sales
}); // end of d3.json deaths



// Vallie's radial chart
//Chart code 
/* Create chart instance */
var chart = am4core.create("chartdivRadial", am4charts.RadarChart);

/* Add data */
chart.data = [{
  "country": "Lithuania",
  "litres": 501,
  "units": 250
}, {
  "country": "Czech Republic",
  "litres": 301,
  "units": 222
}, {
  "country": "Ireland",
  "litres": 266,
  "units": 179
}, {
  "country": "Germany",
  "litres": 165,
  "units": 298
}, {
  "country": "Australia",
  "litres": 139,
  "units": 299
}, {
  "country": "Austria",
  "litres": 336,
  "units": 185
}, {
  "country": "UK",
  "litres": 290,
  "units": 150
}, {
  "country": "Belgium",
  "litres": 325,
  "units": 382
}, {
  "country": "The Netherlands",
  "litres": 40,
  "units": 172
}];

/* Create axes */
var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "country";

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

/* Create and configure series */
var series = chart.series.push(new am4charts.RadarSeries());
series.dataFields.valueY = "litres";
series.dataFields.categoryX = "country";
series.name = "Sales";
series.strokeWidth = 3;
series.zIndex = 2;

var series2 = chart.series.push(new am4charts.RadarColumnSeries());
series2.dataFields.valueY = "units";
series2.dataFields.categoryX = "country";
series2.name = "Units";
series2.strokeWidth = 0;
series2.columns.template.fill = am4core.color("#CDA2AB");
series2.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";