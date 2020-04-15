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
    var yearList = sales.map(s => s.Year);
    yearList.sort();   
    var yearDictionary = {}; 
    yearList.forEach((year) => {
      year = parseInt(year); 
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
    console.log("yearDictionary"); 
    console.log(yearDictionary); 

    // Next, extract the prescription data for each drug type. Note that this currently
    // addes together all of the prescription data for each state--so you can't currently
    // filter by a particular state. Yes, it's possible to filter by state, but ... one
    // thing at a time.
    var newData = [];
    const yearKeys = Object.keys(yearDictionary);     

    // For each year in the list of years ...
    for (const yearKey of yearKeys) {

      // ... filter out the Oxycodone values and sum them up for each state
      var oxyData = sales.filter(d => d["Oxycodone / Hydrocodone"] === "Oxycodone" && d["Year"] == yearKey);
      var oxySum = 0.0;
      oxyData.forEach((item) => {
        oxySum += parseFloat(item["Prescriptions per 100,000"]); 
      });

      // ... filter out the Hydrocodone values and sum them up for each state
      var hydroData = sales.filter(d => d["Oxycodone / Hydrocodone"] === "Hydrocodone" && d["Year"] == yearKey);
      var hydroSum = 0.0; 
      hydroData.forEach((item) => {
        hydroSum += parseFloat(item["Prescriptions per 100,000"]); 
      });

      // console.log(`year: ${yearKey}, oxySum: ${oxySum}`); 
      // console.log(`year: ${yearKey}, hydroSum: ${hydroSum}`); 

      // Build a new dictionary containing the year, Oxycodone prescriptions, and Hydrocodone prescriptions
      var newDict = {}; 
      newDict["Year"] = yearKey;
      newDict["Oxy"] = oxySum;
      newDict["Hydro"] = hydroSum; 

      // Finally, add this new dictionary to the array
      newData.push(newDict); 
    }

    // newData now contains an array of objects, where each object looks
    // like this:
    // { "Year": "2000",
    //   "Oxy":  316.74734,
    //   "Hydro": 247.3340 }

    // Here's a look at newData
    console.log("newData"); 
    console.log(newData);

    
    // TBD: Vallie, remove this stuff below ...
    const minYear = "2000";
    const maxYear = "2018";
    for (i = minYear; i <maxYear; i++){
      thatYear = sales.filter(d => d.Year === i);
      //console.log("thatYear:", thatYear);
    
      var oxy = thatYear.filter(dt => dt["Oxycodone / Hydrocodone"] === "Oxycodone");
      //console.log("oxy:", oxy);
      var hydro = thatYear.filter(dt => dt["Oxycodone / Hydrocodone"] === "Hydrocodone");
      


      var oxySales = [];
      var hydroSales = [];
      totalSales = [];

      for (var j = 0; j < oxy.length; j++) {
        oxySales.push(parseFloat(oxy[j]["Prescriptions per 100,000"]));
        hydroSales.push(parseFloat(hydro[j]["Prescriptions per 100,000"]));
        totalSales.push(parseFloat(
          (oxy[j]["Prescriptions per 100,000"] +
          hydro[j]["Prescriptions per 100,000"])
        ));
      }
      console.log("oxySales:", oxySales);
      var object = {"Year": thatYear,
                    "Oxy Sales": oxySales,
                    "Hydro Sales": hydroSales,
                    "Total Sales": totalSales}
      console.log("object:", object);



      // var syntheticDeaths = [];

      // for (var j = 0; j < synthetic.length; j++) {
      //   syntheticDeaths.push(synthetic[j]["Deaths per 100,000"]);
      // }
      // console.log("syntheticDeaths:", syntheticDeaths);
      // var object = {"Total Synthetic Deaths": syntheticDeaths}
      // console.log("OBJECT:", object);
   
    }


    

      
      




    








    

    
  
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