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


var link = "http://127.0.0.1:5000/api/v1.0/deathTest";

d3.json(link).then(function(data){
  var d = data;

  var barData = [
      {
          x: data["Deaths per 100,000"]*100,
          y: data["State"]
      }
  ];


  Plotly.newPlot('line',barData);


});

//back up stuff

// d3.json(deathsUrl).then(function(deaths){
//   d3.json(salesUrl).then(function(sales){

//     deathsDB = deaths;
//     salesDB = sales;
  

//     var minYear = 2000;
//     var maxYear = 2018;

//         for (i = minYear; i <= maxYear; i++) 
//         thisYear= deathsDB.map(deathsDB => deathsDB.Year === parseInt(i));
//         totalHeroin = thisYear.filter(dt =>["Drug Type"]==="Heroin")
//         // console.log("totalHeroin:", totalHeroin);

//         var object = {
//                         "Year":thisYear,
//                         "Heroin":totalHeroin

//         }
//         console.log(object)

        

//   })
// });


var series



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
