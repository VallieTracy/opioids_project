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

  }); // end of d3.json sales
}); // end of d3.json deaths





// }
//   })
// });

// // })
var chart = am4core.create("chartdiv", am4charts.XYChart);

chart.data = [{
  "year": "1994",
  "cars": 1587,
  "motorcycles": 650,
  "bicycles": 121
}, {
  "year": "1995",
  "cars": 1567,
  "motorcycles": 683,
  "bicycles": 146
}, {
  "year": "1996",
  "cars": 1617,
  "motorcycles": 691,
  "bicycles": 138
}, {
  "year": "1997",
  "cars": 1630,
  "motorcycles": 642,
  "bicycles": 127
}, {
  "year": "1998",
  "cars": 1660,
  "motorcycles": 699,
  "bicycles": 105
}, {
  "year": "1999",
  "cars": 1683,
  "motorcycles": 721,
  "bicycles": 109
}, {
  "year": "2000",
  "cars": 1691,
  "motorcycles": 737,
  "bicycles": 112
}, {
  "year": "2001",
  "cars": 1298,
  "motorcycles": 680,
  "bicycles": 101
}, {
  "year": "2002",
  "cars": 1275,
  "motorcycles": 664,
  "bicycles": 97
}, {
  "year": "2003",
  "cars": 1246,
  "motorcycles": 648,
  "bicycles": 93
}, {
  "year": "2004",
  "cars": 1318,
  "motorcycles": 697,
  "bicycles": 111
}, {
  "year": "2005",
  "cars": 1213,
  "motorcycles": 633,
  "bicycles": 87
}, {
  "year": "2006",
  "cars": 1199,
  "motorcycles": 621,
  "bicycles": 79
}, {
  "year": "2007",
  "cars": 1110,
  "motorcycles": 210,
  "bicycles": 81
}, {
  "year": "2008",
  "cars": 1165,
  "motorcycles": 232,
  "bicycles": 75
}, {
  "year": "2009",
  "cars": 1145,
  "motorcycles": 219,
  "bicycles": 88
}, {
  "year": "2010",
  "cars": 1163,
  "motorcycles": 201,
  "bicycles": 82
}, {
  "year": "2011",
  "cars": 1180,
  "motorcycles": 285,
  "bicycles": 87
}, {
  "year": "2012",
  "cars": 1159,
  "motorcycles": 277,
  "bicycles": 71
}];

chart.dateFormatter.inputDateFormat = "yyyy";
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 60;
dateAxis.startLocation = 0.5;
dateAxis.endLocation = 0.5;
dateAxis.baseInterval = {
  timeUnit: "year",
  count: 1
}

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.tooltip.disabled = true;

var series = chart.series.push(new am4charts.LineSeries());
series.dataFields.dateX = "year";
series.name = "cars";
series.dataFields.valueY = "cars";
series.tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/car.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
series.tooltipText = "[#000]{valueY.value}[/]";
series.tooltip.background.fill = am4core.color("#FFF");
series.tooltip.getStrokeFromObject = true;
series.tooltip.background.strokeWidth = 3;
series.tooltip.getFillFromObject = false;
series.fillOpacity = 0.6;
series.strokeWidth = 2;
series.stacked = true;

var series2 = chart.series.push(new am4charts.LineSeries());
series2.name = "motorcycles";
series2.dataFields.dateX = "year";
series2.dataFields.valueY = "motorcycles";
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
series3.name = "bicycles";
series3.dataFields.dateX = "year";
series3.dataFields.valueY = "bicycles";
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

range.label.text = "Fines for speeding increased";
range.label.inside = true;
range.label.rotation = 90;
range.label.horizontalCenter = "right";
range.label.verticalCenter = "bottom";

var range2 = dateAxis.axisRanges.create();
range2.date = new Date(2007, 0, 1);
range2.grid.stroke = chart.colors.getIndex(7);
range2.grid.strokeOpacity = 0.6;
range2.grid.strokeDasharray = "5,2";


range2.label.text = "Motorcycle fee introduced";
range2.label.inside = true;
range2.label.rotation = 90;
range2.label.horizontalCenter = "right";
range2.label.verticalCenter = "bottom";

// end am4core.ready

