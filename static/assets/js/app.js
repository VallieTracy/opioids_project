// Creating map object


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

var deathsDB, salesDB;

d3.json(deathsUrl).then(function(deaths){
  d3.json(salesUrl).then(function(sales) {

    deathsDB = deaths;
    salesDB = sales;

    var sel = d3.select('#stateSelect');
    sel.html('');

    var states = [];

    sales.forEach(obj => {
      if(!states.includes(obj.State)) {
        states.push(obj.State);
      }
  });

  states.forEach(state => {
    sel
      .append('option')
      .text(state);
  });
  
    console.log("DEATHS:", deaths);
    console.log("SALES:", sales);
    console.log("sales[0]:", sales[0]["Prescriptions per 100,000"]);
    var bamaTotal = parseFloat(sales[0]["Prescriptions per 100,000"]) + parseFloat(sales[1]["Prescriptions per 100,000"]);
    console.log(bamaTotal);


    
   
    

    
  
  }); // end of d3.json sales
}); // end of d3.json deaths


// var mymap = L.map('map')
//   .setView([38.27, -100.86], 4);

// // map.invalidateSize(true);

// // Adding tile layer
// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: API_KEY
// }).addTo(mymap);


// // var link = "http://127.0.0.1:5000/api/v1.0/deathTest";
// var link = "http://127.0.0.1:5000/api/v1.0/deathTest";

// // d3.json(link).then(function(data){
// //   var d = data;

// //   var barData = [
// //       {
// //           x: data["Deaths per 100,000"]*100,
// //           y: data["State"]
// //       }
// //   ];

// d3.json(link).then(function(data){
//     var d = data;

//     var opioidsTest = [];
//     for (var i = 0; i<data.length; i++){
//       var deaths;
//       var state;
//       if ((data[i]["Drug Type"]==="All opioids") && (data[i]["Year"]=="2000")){
//         deaths = data[i]["Deaths per 100,000"];
//         state = data[i]["State"];
//         opioidsTest.push({"Deaths": deaths, "State": state})
     
//       }
      
//     };
//     console.log(opioidsTest);
  
//   Plotly.newPlot('line',opioidsTest);

//   // Plotly.newPlot('line', barData);


// });

