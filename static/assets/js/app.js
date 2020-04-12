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

var deathsUrl = "http://127.0.0.1:5000/api/v1.0/deathTest";
var salesUrl = "http://127.0.0.1:5000/api/v1.0/prescriptionTest";

d3.json(deathsUrl).then(function(deaths){
  d3.json(salesUrl).then(function(sales) {
    console.log("deaths:", deaths);
    console.log(deaths[700]["Fips"]);
    console.log(deaths[700]["Year"]);
    console.log(deaths[700]["Drug Type"]);
    console.log(deaths[700]["State"]);
    console.log("0", deaths[0]["Deaths per 100,000"]);
    console.log("2", deaths[2]["Deaths per 100,000"]);

    // for (var i = 0; i < 15; i++) {
    //   if (deaths[i]["Deaths per 100,000"] == "N/A") {
    //     deaths[i]["Deaths per 100,000"] =+ deaths[i]["Deaths per 100,000"]
    //   }
    //   // else {
    //   //   parseInt(deaths[i]["Deaths per 100,000"]);
    //   // }
    //   console.log(deaths[i]["Deaths per 100,000"]);
    // }
  
  }); // end of d3.json sales
}); // end of d3.json deaths



// Vallie's radial chart
//Chart code 
var chart = am4core.create("chartdiv", am4charts.RadarChart);

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