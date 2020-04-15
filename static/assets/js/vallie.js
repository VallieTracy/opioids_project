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

     
  }); // end of d3.json sales
}); // end of d3.json deaths



