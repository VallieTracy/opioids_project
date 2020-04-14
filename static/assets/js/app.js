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

    // var minYear = 2000;
    // var maxYear = 2018;
    // var salesArray = [];
    
    // var timeFrame = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018];

    // for (var t = 0; t < timeFrame.length; t++) {
    //   var year = timeFrame[t]
    //   //console.log("YEARS:", year);
    //   salesArray.push({"Year": year});
    // }

    // for (var i = 0; i < sales.length; i++) {
    //   if ((sales[i]["State"] === "Alabama") && (sales[i]["Oxycodone / Hydrocodone"] === "Oxycodone")) {
    //     console.log("rxSales:", sales[i]["Prescriptions per 100,000"]);
    //   }
    // }
    // for (var i = 0; i < timeFrame.length; i++) {
      
      
    //   var year = timeFrame[i];
      

    //   if ((sales[i]["State"] === "Alabama")) {
    //     //console.log("YEAR:", sales[i]["Year"]);
    //     console.log("YEAR:", year);
    //     console.log("Drug Sales Amount:", sales[i]["Prescriptions per 100,000"]);
    //   }
            
    //   // if ((sales[i]["Oxycodone / Hydrocodone"] === "Oxycodone") && (sales[i]["Year"] === "2000")) {
    //   //   //console.log("STATE:", sales[i]["State"]);
    //   //   //console.log("Oxycodone Sales in 2000:", sales[i]["Prescriptions per 100,000"]);
    //   //   state = sales[i]["State"];
    //   //   oxy2000 = parseFloat(sales[i]["Prescriptions per 100,000"]);
    //   //   salesArray.push({"State": state, "Oxy Sales 2000": oxy2000});
    //   // }
    // }
    //console.log("salesArray:", salesArray);

    // for (var j = 0; j < deaths.length; j++) {
    //   if ((deaths[j]["Drug Type"] === "Natural and semi-synthetic opioids") && (deaths[j]["Year"] === "2000")) {
    //     console.log("STATE:", deaths[j]["State"]);
    //     console.log("Natural, etc Deaths in 2000:", deaths[j]["Deaths per 100,000"]);

    //   }
    // }   
      // DOM's STUFF   
      // thisYear = deaths.filter(deaths => deaths.Year === parseInt(i));
      // console.log("thisYear:", thisYear);
      // var object = {
      //               "Year": thisYear}
      // console.log("OBJECT:", object);


    








    
    // var years = [];
    // var rxType = [];
    // var deathDrugs = [];

    // sales.forEach(obj => {
    //   if(!years.includes(obj.Year)) {
    //     years.push(obj.Year);
    //   }
    //   if(!rxType.includes(obj["Oxycodone / Hydrocodone"])) {
    //     rxType.push(obj["Oxycodone / Hydrocodone"]);
    //   }      
    // });
    
    // deaths.forEach(obj => {
    //   if(!deathDrugs.includes(obj["Drug Type"])) {
    //     deathDrugs.push(obj["Drug Type"]);
    //   }
    // });
    // console.log("Years:", years);
    // console.log("States:", states);
    // console.log("rxType:", rxType)
    // console.log("Death Drugs:", deathDrugs);



    


  
    console.log("sales[0]:", sales[0]["Prescriptions per 100,000"]);
    var bamaTotal = parseFloat(sales[0]["Prescriptions per 100,000"]) + parseFloat(sales[1]["Prescriptions per 100,000"]);
    console.log(bamaTotal);  
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