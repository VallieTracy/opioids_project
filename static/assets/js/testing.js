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
